import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PriTable = ({ namePrefix = "" }) => {
  const { control, register, watch, setValue } = useFormContext();
  const tableName = namePrefix ? `${namePrefix}.priTables` : "priTables";
  const typeName = namePrefix ? `${namePrefix}.priType` : "priType";
  const className = namePrefix ? `${namePrefix}.priClass` : "priClass";

  const { fields, append, remove } = useFieldArray({
    control,
    name: tableName,
  });
  const currentClass = watch(className) || "Range";
  const priType = (watch(typeName) || "").toLowerCase();

  return (
    <div className="pb-6 mb-6 border-b border-[#fff]/10">
      <div className="text-sm text-white/70 font-mono">PRI Table</div>

      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PRI Type */}
        <div>
          <Label className="block text-xs text-white/70 mb-2">PRI Type</Label>
          <Select
            value={watch(typeName) || ""}
            onValueChange={(value) => setValue(typeName, value)}
          >
            <SelectTrigger className="w-full bg-[#FFFFFF0D] border border-black/10 text-white">
              <SelectValue placeholder="Select PRI type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STABLE">Stable</SelectItem>
              <SelectItem value="STAGGER">Stagger</SelectItem>
              <SelectItem value="JITTER">Jitter</SelectItem>
              <SelectItem value="SINGLE PULSE">Single Pulse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PRI Class */}
        <div className="md:col-span-2">
          <Label className="block text-xs text-white/70 mb-2">PRI Class</Label>
          <div className="flex gap-2">
            {["Range", "Discrete"].map((val) => (
              <Button
                key={val}
                type="button"
                className={`rounded-[4px] px-10 text-white ${
                  currentClass === val
                    ? "bg-[#7B70D6] hover:bg-[#665adb]"
                    : "bg-[#828E9C] hover:bg-[#677687]"
                }`}
                onClick={() => setValue(className, val)}
              >
                {val}
              </Button>
            ))}
            <Button
              type="button"
              variant="link"
              className="ml-2 text-[#C5BFFF] hover:text-[#C5BFFF]"
              onClick={() => {
                if (priType === "single pulse") {
                  append({ fewpulseMinPri: "", fewpulseMaxPri: "" });
                } else {
                  append({
                    priMin: "",
                    priMax: "",
                    deviation: "",
                    staggerLevel: "",
                  });
                }
              }}
            >
              + Add PRI Row
            </Button>
          </div>
        </div>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="mt-4 p-4 bg-[#37383B] rounded border border-[#fff]/10"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">PRI Row {index + 1}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </Button>
          </div>

          {/* Dynamic inputs based on PRI Type */}
          {priType === "single pulse" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  FEWPULSE MIN PRI
                </Label>
                <Input
                  {...register(`${tableName}.${index}.fewpulseMinPri`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  FEWPULSE MAX PRI
                </Label>
                <Input
                  {...register(`${tableName}.${index}.fewpulseMaxPri`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  PRI MIN
                </Label>
                <Input
                  {...register(`${tableName}.${index}.priMin`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  PRI MAX
                </Label>
                <Input
                  {...register(`${tableName}.${index}.priMax`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  DEVIATION
                </Label>
                <Input
                  {...register(`${tableName}.${index}.deviation`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
              <div>
                <Label className="block text-xs text-white/70 mb-1">
                  STAGGER LEVEL
                </Label>
                <Input
                  {...register(`${tableName}.${index}.staggerLevel`)}
                  className="bg-[#FFFFFF0D] border-black/10 text-white"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PriTable;
