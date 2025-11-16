/**
 * CollapsibleSectionManager - Manages collapsible trait sections
 *
 * Groups related traits into collapsible sections for better organization
 * and improved UX. Works in conjunction with TraitTabManager.
 */

export interface TraitSection {
  title: string;
  traits: any[];
  defaultOpen?: boolean;
  icon?: string;
}

export interface SectionState {
  [sectionName: string]: boolean; // true = open, false = collapsed
}

export class CollapsibleSectionManager {
  private editor: any;
  private sectionStates: SectionState = {};
  private readonly STORAGE_KEY = 'grapesjs-section-states';

  constructor(editor: any) {
    this.editor = editor;
    this.loadSectionStates();
  }

  /**
   * Organize traits into sections based on their section metadata
   */
  organizeSections(traits: any[]): Map<string, any[]> {
    const sections = new Map<string, any[]>();

    traits.forEach(trait => {
      const sectionName = trait.get('section') || 'general';

      if (!sections.has(sectionName)) {
        sections.set(sectionName, []);
      }

      sections.get(sectionName)!.push(trait);
    });

    return sections;
  }

  /**
   * Render sections for a specific tab
   */
  renderSections(container: HTMLElement, traits: any[], tabCategory: string): void {
    // Filter traits by tab category
    const categoryTraits = traits.filter(trait => {
      const category = trait.get('category') || 'content';
      return category === tabCategory;
    });

    // Organize into sections
    const sections = this.organizeSections(categoryTraits);

    // Clear existing content
    container.innerHTML = '';

    // If no traits, show empty state
    if (categoryTraits.length === 0) {
      this.renderEmptyState(container, tabCategory);
      return;
    }

    // Render each section
    sections.forEach((sectionTraits, sectionName) => {
      const sectionEl = this.createSection(sectionName, sectionTraits);
      container.appendChild(sectionEl);
    });
  }

  /**
   * Create a collapsible section element
   */
  private createSection(sectionName: string, traits: any[]): HTMLElement {
    const sectionId = `section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
    const isOpen = this.getSectionState(sectionId);

    // Create section container
    const section = document.createElement('div');
    section.className = `trait-section ${isOpen ? '' : 'collapsed'}`;
    section.setAttribute('data-section', sectionId);

    // Create section header
    const header = document.createElement('div');
    header.className = 'trait-section-header';
    header.innerHTML = `
      <span class="trait-section-title">${this.formatSectionTitle(sectionName)}</span>
      <span class="arrow">▼</span>
    `;

    // Add click handler to toggle
    header.addEventListener('click', () => {
      this.toggleSection(sectionId, section);
    });

    // Create section content
    const content = document.createElement('div');
    content.className = 'trait-section-content';

    // Add traits to content
    traits.forEach(trait => {
      const traitEl = this.findTraitElement(trait.get('name'));
      if (traitEl) {
        content.appendChild(traitEl.cloneNode(true));
      }
    });

    section.appendChild(header);
    section.appendChild(content);

    return section;
  }

  /**
   * Toggle section open/closed state
   */
  private toggleSection(sectionId: string, sectionEl: HTMLElement): void {
    const isCollapsed = sectionEl.classList.contains('collapsed');

    if (isCollapsed) {
      sectionEl.classList.remove('collapsed');
      this.setSectionState(sectionId, true);
    } else {
      sectionEl.classList.add('collapsed');
      this.setSectionState(sectionId, false);
    }
  }

  /**
   * Get section state (open/collapsed)
   */
  private getSectionState(sectionId: string): boolean {
    // Default to open if not set
    return this.sectionStates[sectionId] !== false;
  }

  /**
   * Set section state
   */
  private setSectionState(sectionId: string, isOpen: boolean): void {
    this.sectionStates[sectionId] = isOpen;
    this.saveSectionStates();
  }

  /**
   * Load section states from localStorage
   */
  private loadSectionStates(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.sectionStates = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load section states from localStorage', e);
    }
  }

  /**
   * Save section states to localStorage
   */
  private saveSectionStates(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sectionStates));
    } catch (e) {
      console.warn('Failed to save section states to localStorage', e);
    }
  }

  /**
   * Format section title for display
   */
  private formatSectionTitle(sectionName: string): string {
    // Convert camelCase or snake_case to Title Case
    return sectionName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  /**
   * Find trait element in DOM by trait name
   */
  private findTraitElement(traitName: string): HTMLElement | null {
    return document.querySelector(`[data-trait-name="${traitName}"]`) as HTMLElement;
  }

  /**
   * Render empty state when no traits in section
   */
  private renderEmptyState(container: HTMLElement, tabCategory: string): void {
    const emptyState = document.createElement('div');
    emptyState.className = 'trait-empty-state';
    emptyState.innerHTML = `
      <div class="trait-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p class="trait-empty-text">No ${tabCategory} settings available</p>
      <p class="trait-empty-hint">This widget doesn't have any ${tabCategory} options</p>
    `;
    container.appendChild(emptyState);
  }

  /**
   * Get default section configurations
   */
  static getDefaultSections(): { [key: string]: { title: string; icon?: string } } {
    return {
      // Content tab sections
      content: { title: 'Content', icon: '📝' },
      structure: { title: 'Structure', icon: '🏗️' },
      items: { title: 'Items', icon: '📋' },
      settings: { title: 'Settings', icon: '⚙️' },

      // Style tab sections
      typography: { title: 'Typography', icon: '📄' },
      colors: { title: 'Colors', icon: '🎨' },
      background: { title: 'Background', icon: '🖼️' },
      border: { title: 'Border', icon: '⬜' },
      'box-shadow': { title: 'Box Shadow', icon: '☁️' },
      spacing: { title: 'Spacing', icon: '📐' },
      layout: { title: 'Layout', icon: '📊' },
      effects: { title: 'Effects', icon: '✨' },

      // Advanced tab sections
      position: { title: 'Position', icon: '📍' },
      responsive: { title: 'Responsive', icon: '📱' },
      css: { title: 'Custom CSS', icon: '💻' },
      attributes: { title: 'Attributes', icon: '🏷️' },
      animation: { title: 'Animation', icon: '🎬' },
      visibility: { title: 'Visibility', icon: '👁️' }
    };
  }

  /**
   * Collapse all sections
   */
  collapseAll(): void {
    const sections = document.querySelectorAll('.trait-section');
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section');
      if (sectionId) {
        section.classList.add('collapsed');
        this.setSectionState(sectionId, false);
      }
    });
  }

  /**
   * Expand all sections
   */
  expandAll(): void {
    const sections = document.querySelectorAll('.trait-section');
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section');
      if (sectionId) {
        section.classList.remove('collapsed');
        this.setSectionState(sectionId, true);
      }
    });
  }

  /**
   * Destroy the section manager
   */
  destroy(): void {
    this.saveSectionStates();
    this.sectionStates = {};
  }
}
