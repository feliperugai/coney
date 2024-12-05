import { Paintbrush } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import RequiredInput from "./required-input";

export function ColorPicker({
  background,
  setBackground,
  className,
  enabledTabs = { solid: true, gradient: true, image: true },
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
  enabledTabs?: {
    solid?: boolean;
    gradient?: boolean;
    image?: boolean;
  };
}) {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#b91d73",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
    "#C0C0C0",
    "#A0A0A0",
    "#ff91d8",
    "#ff5c9e",
    "#8f1458",
    "#ff8a1f",
    "#d4c123",
    "#8bcf3d",
    "#4fc3dc",
    "#7a45c8",
    "#001f3f",
    "#5f9ea0",
    "#ffcc99",
    "#ffcc66",
    "#99ccff",
    "#6699cc",
    "#cc6699",
  ];

  const gradients = [
    "linear-gradient(to top left,#accbee,#e7f0fd)",
    "linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
    "linear-gradient(to top left,#000000,#434343)",
    "linear-gradient(to top left,#09203f,#537895)",
    "linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)",
    "linear-gradient(to top left,#f953c6,#b91d73)",
    "linear-gradient(to top left,#ee0979,#ff6a00)",
    "linear-gradient(to top left,#F00000,#DC281E)",
    "linear-gradient(to top left,#00c6ff,#0072ff)",
    "linear-gradient(to top left,#4facfe,#00f2fe)",
    "linear-gradient(to top left,#0ba360,#3cba92)",
    "linear-gradient(to top left,#FDFC47,#24FE41)",
    "linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)",
    "linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
    "linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
    "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
  ];

  const images = [
    "url(/api/placeholder/400/320)",
    "url(/api/placeholder/400/320)",
    "url(/api/placeholder/400/320)",
    "url(/api/placeholder/400/320)",
  ];

  // Calculate available tabs
  const availableTabs = Object.entries(enabledTabs)
    .filter(([_, enabled]) => enabled)
    .map(([tab]) => tab);

  const [open, setOpen] = useState(false);

  // Determine default tab
  const defaultTab = useMemo(() => {
    if (availableTabs.length === 0 || !background) return "solid";
    
    if (background.includes("url") && enabledTabs.image) return "image";
    if (background.includes("gradient") && enabledTabs.gradient)
      return "gradient";
    return availableTabs[0];
  }, [background, enabledTabs, availableTabs]);

  const renderContent = (tabName: string | undefined) => {
    switch (tabName) {
      case "solid":
        return (
          <div className="mt-0 flex flex-wrap gap-1">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                onClick={() => {
                  setBackground(s);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        );
      case "gradient":
        return (
          <div className="mt-0">
            <div className="mb-2 flex flex-wrap gap-1">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                  onClick={() => {
                    setBackground(s);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
            <GradientButton background={background} />
          </div>
        );
      case "image":
        return (
          <div className="mt-0">
            <div className="mb-2 grid grid-cols-2 gap-1">
              {images.map((s) => (
                <div
                  key={s}
                  style={{ backgroundImage: s }}
                  className="h-12 w-full cursor-pointer rounded-md bg-cover bg-center active:scale-105"
                  onClick={() => {
                    setBackground(s);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
            <GradientButton background={background} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        {availableTabs.length === 1 ? (
          <>
            {renderContent(availableTabs[0])}
            <Input
              id="custom"
              value={background}
              className="col-span-2 mt-4 h-8"
              onChange={(e) => setBackground(e.currentTarget.value)}
            />
          </>
        ) : (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-4 w-full">
              {enabledTabs.solid && (
                <TabsTrigger className="flex-1" value="solid">
                  Solid
                </TabsTrigger>
              )}
              {enabledTabs.gradient && (
                <TabsTrigger className="flex-1" value="gradient">
                  Gradient
                </TabsTrigger>
              )}
              {enabledTabs.image && (
                <TabsTrigger className="flex-1" value="image">
                  Image
                </TabsTrigger>
              )}
            </TabsList>

            {enabledTabs.solid && (
              <TabsContent value="solid">{renderContent("solid")}</TabsContent>
            )}
            {enabledTabs.gradient && (
              <TabsContent value="gradient">
                {renderContent("gradient")}
              </TabsContent>
            )}
            {enabledTabs.image && (
              <TabsContent value="image">{renderContent("image")}</TabsContent>
            )}

            <Input
              id="custom"
              value={background}
              className="col-span-2 mt-4 h-8"
              onChange={(e) => setBackground(e.currentTarget.value)}
            />
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
}

const GradientButton = ({ background }: { background: string }) => {
  return (
    <div
      className="relative rounded-md !bg-cover !bg-center p-0.5 transition-all"
      style={{ background }}
    />
  );
};

interface FieldInputProps {
  label?: string;
  description?: string;
  name: string;
  disabled?: boolean;
  containerClassName?: string;
  required?: boolean;
  readonly?: boolean;
  enabledTabs?: {
    solid?: boolean;
    gradient?: boolean;
    image?: boolean;
  };
}
export function FormColorPicker({
  label,
  description,
  disabled = false,
  name,
  containerClassName,
  required,
  enabledTabs,
  readonly = false,
}: FieldInputProps) {
  const form = useFormContext();

  return (
    <div className={cn(containerClassName)}>
      <FormField
        control={form.control}
        name={name}
        disabled={disabled}
        render={({ field }) => {
          return (
            <FormItem className="mb-3 flex flex-col gap-2">
              {label && (
                <FormLabel>
                  {label} {required && !readonly && <RequiredInput />}
                </FormLabel>
              )}
              {readonly ? (
                <div>{field.value || "-"}</div>
              ) : (
                <FormControl>
                  <ColorPicker
                    background={field.value}
                    setBackground={field.onChange}
                    enabledTabs={enabledTabs}
                  />
                </FormControl>
              )}
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

export default ColorPicker;
