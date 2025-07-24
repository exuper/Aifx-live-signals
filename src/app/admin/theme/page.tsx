
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getThemeData, updateThemeData, ThemeData } from './actions';
import { Loader2, Palette } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;
const themeSchema = z.object({
  primary: z.string().regex(hslColorRegex, "Must be HSL values like '72 100% 50%'"),
  background: z.string().regex(hslColorRegex, "Must be HSL values"),
  accent: z.string().regex(hslColorRegex, "Must be HSL values"),
});


function HSLColorPicker({ name, control, label, errors, watch, setValue }: any) {
    const hslString = watch(name) || '0 0% 0%';
    const [h, s, l] = hslString.split(' ').map((v: string) => parseInt(v));

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hex = e.target.value;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return;
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        setValue(name, `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`, { shouldValidate: true });
    };

    function hslToHex(h: number, s: number, l: number) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="flex items-center gap-4 p-2 border rounded-md">
                 <div className="relative">
                    <input
                        type="color"
                        className="w-10 h-10 p-0 border-none appearance-none bg-transparent cursor-pointer"
                        value={hslToHex(h || 0, s || 0, l || 0)}
                        onChange={handleColorChange}
                        style={{'--color': `hsl(${hslString})`} as React.CSSProperties}
                    />
                    <div className="absolute inset-0 w-10 h-10 rounded-md pointer-events-none" style={{backgroundColor: `hsl(${hslString})`}} />
                </div>
                <div className="flex-1">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={name}
                                {...field}
                                className="font-mono"
                                placeholder="e.g. 72 100% 50%"
                            />
                        )}
                    />
                </div>
            </div>
            {errors[name] && <p className="text-red-500 text-xs">{errors[name].message as string}</p>}
        </div>
    );
}

export default function ManageThemePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ThemeData>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
        primary: '',
        background: '',
        accent: ''
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getThemeData();
        reset(data);
      } catch (error) {
        toast({
          title: "Error loading theme",
          description: "Could not fetch theme data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: ThemeData) => {
    setIsSubmitting(true);
    try {
      await updateThemeData(data);
      toast({
        title: "Theme Updated!",
        description: "Your new theme has been applied.",
      });
      // Force a reload to see theme changes immediately
      window.location.reload();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not save your theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Theme Settings"
                description="Customize the look and feel of your application."
            />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-8">
                   <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                   </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PageHeader
        title="Theme Settings"
        description="Customize the look and feel of your application. Colors are in HSL format."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Brand Colors
          </CardTitle>
          <CardDescription>
            Click the color swatch to use a color picker, or enter HSL values directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <HSLColorPicker name="primary" control={control} label="Primary Color" errors={errors} watch={watch} setValue={setValue} />
          <HSLColorPicker name="background" control={control} label="Background Color" errors={errors} watch={watch} setValue={setValue} />
          <HSLColorPicker name="accent" control={control} label="Accent Color" errors={errors} watch={watch} setValue={setValue} />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save Theme'}
        </Button>
      </div>

    </form>
  );
}
