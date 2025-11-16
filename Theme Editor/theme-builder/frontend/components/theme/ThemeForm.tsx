import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTheme } from '@/lib/hooks/useThemes';

const themeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  font: z.string().min(1, 'Font is required'),
});

type ThemeFormInputs = z.infer<typeof themeSchema>;

const ThemeForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ThemeFormInputs>({
    resolver: zodResolver(themeSchema),
  });
  
  const { mutate: createTheme } = useCreateTheme();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const onSubmit = async (data: ThemeFormInputs) => {
    try {
      await createTheme(data);
      // Handle successful theme creation (e.g., redirect or show success message)
    } catch (error) {
      setSubmissionError('Failed to create theme. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      <div>
        <label htmlFor="name" className="block">Theme Name</label>
        <input id="name" {...register('name')} className="input" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="primaryColor" className="block">Primary Color</label>
        <input id="primaryColor" type="color" {...register('primaryColor')} className="input" />
        {errors.primaryColor && <p className="text-red-500">{errors.primaryColor.message}</p>}
      </div>
      <div>
        <label htmlFor="secondaryColor" className="block">Secondary Color</label>
        <input id="secondaryColor" type="color" {...register('secondaryColor')} className="input" />
        {errors.secondaryColor && <p className="text-red-500">{errors.secondaryColor.message}</p>}
      </div>
      <div>
        <label htmlFor="font" className="block">Font</label>
        <input id="font" {...register('font')} className="input" />
        {errors.font && <p className="text-red-500">{errors.font.message}</p>}
      </div>
      <button type="submit" className="btn">Create Theme</button>
    </form>
  );
};

export default ThemeForm;