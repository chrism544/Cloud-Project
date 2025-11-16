/**
 * TraitTabManager - Manages tabbed trait panels for GrapesJS
 *
 * Since GrapesJS doesn't natively support trait tabs, this class
 * injects a custom tab UI into the trait panel and filters traits
 * based on the active tab (Content, Style, Advanced).
 */

import { CollapsibleSectionManager } from './CollapsibleSectionManager';

export type TraitTab = 'content' | 'style' | 'advanced';

export class TraitTabManager {
  private editor: any;
  private activeTab: TraitTab = 'content';
  private tabContainer: HTMLElement | null = null;
  private sectionManager: CollapsibleSectionManager;
  private readonly STORAGE_KEY = 'grapesjs-active-trait-tab';
  private useSections: boolean = true; // Enable section-based organization

  constructor(editor: any, useSections: boolean = true) {
    this.editor = editor;
    this.useSections = useSections;
    this.sectionManager = new CollapsibleSectionManager(editor);
    this.loadActiveTab();
    this.init();
  }

  /**
   * Initialize the tab manager
   * Listens for component selection events and renders tabs
   */
  private init(): void {
    // Listen for component selection
    this.editor.on('component:selected', () => {
      setTimeout(() => {
        this.renderTabs();
        this.filterTraits();
      }, 50); // Small delay to ensure DOM is ready
    });

    // Listen for component deselection
    this.editor.on('component:deselected', () => {
      this.cleanup();
    });
  }

  /**
   * Render tab buttons in the trait panel
   */
  private renderTabs(): void {
    const traitPanel = this.getTraitPanel();
    if (!traitPanel) {
      console.warn('Trait panel not found');
      return;
    }

    // Remove existing tabs if any
    this.cleanup();

    // Create tab container
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = 'elementor-trait-tabs';
    this.tabContainer.innerHTML = `
      <div class="elementor-tab-buttons">
        <button
          class="elementor-tab-btn ${this.activeTab === 'content' ? 'active' : ''}"
          data-tab="content"
          type="button"
          role="tab"
          aria-selected="${this.activeTab === 'content'}"
          aria-controls="content-traits"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>Content</span>
        </button>
        <button
          class="elementor-tab-btn ${this.activeTab === 'style' ? 'active' : ''}"
          data-tab="style"
          type="button"
          role="tab"
          aria-selected="${this.activeTab === 'style'}"
          aria-controls="style-traits"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
          <span>Style</span>
        </button>
        <button
          class="elementor-tab-btn ${this.activeTab === 'advanced' ? 'active' : ''}"
          data-tab="advanced"
          type="button"
          role="tab"
          aria-selected="${this.activeTab === 'advanced'}"
          aria-controls="advanced-traits"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
          </svg>
          <span>Advanced</span>
        </button>
      </div>
    `;

    // Insert tabs before traits
    const traitsContainer = traitPanel.querySelector('.gjs-trt-traits');
    if (traitsContainer) {
      traitsContainer.insertBefore(this.tabContainer, traitsContainer.firstChild);
    } else {
      traitPanel.insertBefore(this.tabContainer, traitPanel.firstChild);
    }

    // Attach event listeners
    this.attachTabHandlers();
  }

  /**
   * Attach click handlers to tab buttons
   */
  private attachTabHandlers(): void {
    if (!this.tabContainer) return;

    const buttons = this.tabContainer.querySelectorAll('.elementor-tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tab = (e.currentTarget as HTMLElement).dataset.tab as TraitTab;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });
  }

  /**
   * Switch to a different tab
   */
  public switchTab(tab: TraitTab): void {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.saveActiveTab();

    // Update button states
    if (this.tabContainer) {
      const buttons = this.tabContainer.querySelectorAll('.elementor-tab-btn');
      buttons.forEach(btn => {
        const btnTab = (btn as HTMLElement).dataset.tab;
        const isActive = btnTab === tab;

        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive.toString());
      });
    }

    // Filter traits
    this.filterTraits();
  }

  /**
   * Filter traits based on active tab
   * Shows/hides trait elements based on their category
   * Uses CollapsibleSectionManager if sections are enabled
   */
  private filterTraits(): void {
    const component = this.editor.getSelected();
    if (!component) return;

    const traits = component.getTraits();
    const traitPanel = this.getTraitPanel();
    if (!traitPanel) return;

    if (this.useSections) {
      // Use section-based organization
      this.filterTraitsWithSections(traits, traitPanel);
    } else {
      // Use simple show/hide
      this.filterTraitsSimple(traits, traitPanel);
    }
  }

  /**
   * Filter traits using collapsible sections
   */
  private filterTraitsWithSections(traits: any[], traitPanel: HTMLElement): void {
    // Hide all existing trait elements first
    const allTraits = traitPanel.querySelectorAll('[data-trait-name]');
    allTraits.forEach((el: Element) => {
      (el as HTMLElement).style.display = 'none';
    });

    // Remove existing sections
    const existingSections = traitPanel.querySelectorAll('.trait-section');
    existingSections.forEach(section => section.remove());

    // Remove existing empty state
    const existingEmpty = traitPanel.querySelector('.trait-empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    // Filter traits by active tab
    const categoryTraits = traits.filter((trait: any) => {
      const category = trait.get('category') || 'content';
      return category === this.activeTab;
    });

    if (categoryTraits.length === 0) {
      this.updateEmptyState(traitPanel);
      return;
    }

    // Organize traits by section
    const sections = this.sectionManager.organizeSections(categoryTraits);

    // Create section wrapper
    const sectionWrapper = document.createElement('div');
    sectionWrapper.className = 'trait-sections-wrapper';

    // Render each section
    sections.forEach((sectionTraits, sectionName) => {
      const sectionEl = this.createCollapsibleSection(sectionName, sectionTraits);
      sectionWrapper.appendChild(sectionEl);
    });

    // Add sections to trait panel
    const traitsContainer = traitPanel.querySelector('.gjs-trt-traits');
    if (traitsContainer) {
      traitsContainer.appendChild(sectionWrapper);
    }
  }

  /**
   * Create a collapsible section
   */
  private createCollapsibleSection(sectionName: string, traits: any[]): HTMLElement {
    const sectionId = `section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
    const isOpen = this.sectionManager['getSectionState'](sectionId);

    // Create section container
    const section = document.createElement('div');
    section.className = `trait-section ${isOpen ? '' : 'collapsed'}`;
    section.setAttribute('data-section', sectionId);

    // Format section title
    const title = this.formatSectionTitle(sectionName);

    // Create section header
    const header = document.createElement('div');
    header.className = 'trait-section-header';
    header.innerHTML = `
      <span class="trait-section-title">${title}</span>
      <span class="arrow">▼</span>
    `;

    // Add click handler
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
      this.sectionManager['setSectionState'](sectionId, !section.classList.contains('collapsed'));
    });

    // Create section content
    const content = document.createElement('div');
    content.className = 'trait-section-content';

    // Add trait elements to content
    traits.forEach((trait: any) => {
      const traitName = trait.get('name');
      const traitEl = document.querySelector(`[data-trait-name="${traitName}"]`);

      if (traitEl) {
        const clonedEl = traitEl.cloneNode(true) as HTMLElement;
        clonedEl.style.display = '';
        content.appendChild(clonedEl);

        // Sync events between original and cloned element
        this.syncTraitElement(traitEl as HTMLElement, clonedEl);
      }
    });

    section.appendChild(header);
    section.appendChild(content);

    return section;
  }

  /**
   * Sync events between original trait element and cloned element
   */
  private syncTraitElement(original: HTMLElement, cloned: HTMLElement): void {
    // Find input elements in both
    const originalInputs = original.querySelectorAll('input, select, textarea, button');
    const clonedInputs = cloned.querySelectorAll('input, select, textarea, button');

    originalInputs.forEach((origInput, index) => {
      const clonedInput = clonedInputs[index];
      if (!clonedInput) return;

      // Sync changes from cloned to original
      ['input', 'change', 'click'].forEach(eventType => {
        clonedInput.addEventListener(eventType, (e) => {
          const event = new Event(eventType, { bubbles: true });
          origInput.dispatchEvent(event);

          // Copy value for inputs
          if (origInput instanceof HTMLInputElement && clonedInput instanceof HTMLInputElement) {
            origInput.value = clonedInput.value;
          } else if (origInput instanceof HTMLSelectElement && clonedInput instanceof HTMLSelectElement) {
            origInput.value = clonedInput.value;
          } else if (origInput instanceof HTMLTextAreaElement && clonedInput instanceof HTMLTextAreaElement) {
            origInput.value = clonedInput.value;
          }
        });
      });
    });
  }

  /**
   * Simple trait filtering (no sections)
   */
  private filterTraitsSimple(traits: any[], traitPanel: HTMLElement): void {
    traits.forEach((trait: any) => {
      const traitName = trait.get('name');
      const category = trait.get('category') || 'content';

      const traitEl = traitPanel.querySelector(`[data-trait-name="${traitName}"]`) as HTMLElement;

      if (traitEl) {
        const shouldShow = category === this.activeTab;
        traitEl.style.display = shouldShow ? '' : 'none';
      }
    });

    this.updateEmptyState(traitPanel);
  }

  /**
   * Format section title
   */
  private formatSectionTitle(sectionName: string): string {
    return sectionName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  /**
   * Update empty state message
   */
  private updateEmptyState(traitPanel: HTMLElement): void {
    // Remove existing empty state
    const existingEmpty = traitPanel.querySelector('.trait-empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    // Check if any traits are visible
    const visibleTraits = Array.from(traitPanel.querySelectorAll('[data-trait-name]'))
      .filter((el: Element) => (el as HTMLElement).style.display !== 'none');

    if (visibleTraits.length === 0) {
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
        <p class="trait-empty-text">No ${this.activeTab} settings available</p>
        <p class="trait-empty-hint">This widget doesn't have any ${this.activeTab} options</p>
      `;

      const traitsContainer = traitPanel.querySelector('.gjs-trt-traits');
      if (traitsContainer) {
        traitsContainer.appendChild(emptyState);
      }
    }
  }

  /**
   * Get the trait panel element
   */
  private getTraitPanel(): HTMLElement | null {
    return document.querySelector('.gjs-trt-traits') as HTMLElement;
  }

  /**
   * Load active tab from localStorage
   */
  private loadActiveTab(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved && ['content', 'style', 'advanced'].includes(saved)) {
        this.activeTab = saved as TraitTab;
      }
    } catch (e) {
      console.warn('Failed to load active tab from localStorage', e);
    }
  }

  /**
   * Save active tab to localStorage
   */
  private saveActiveTab(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.activeTab);
    } catch (e) {
      console.warn('Failed to save active tab to localStorage', e);
    }
  }

  /**
   * Cleanup - remove tab container
   */
  private cleanup(): void {
    if (this.tabContainer && this.tabContainer.parentNode) {
      this.tabContainer.remove();
      this.tabContainer = null;
    }
  }

  /**
   * Destroy the tab manager
   */
  public destroy(): void {
    this.cleanup();
    this.editor.off('component:selected');
    this.editor.off('component:deselected');
  }

  /**
   * Get current active tab
   */
  public getActiveTab(): TraitTab {
    return this.activeTab;
  }

  /**
   * Check if a trait should be visible based on current tab
   */
  public isTraitVisible(traitCategory: string): boolean {
    return traitCategory === this.activeTab;
  }
}
