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

const PwTable = ({ namePrefix = "" }) => {
  const { control, register, watch, setValue } = useFormContext();
  const tableName = namePrefix ? `${namePrefix}.pwTables` : "pwTables";
  const typeName = namePrefix ? `${namePrefix}.pwType` : "pwType";
  const className = namePrefix ? `${namePrefix}.pwClass` : "pwClass";

  const { fields, append, remove } = useFieldArray({
    control,
    name: tableName,
  });
  const currentClass = watch(className) || "Range";

  return (
    <div className="pb-6 mb-6 border-b border-[#fff]/10">
      <div className="text-sm text-white/70 font-mono">PW Table</div>

      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PW Type */}
        <div>
          <Label className="block text-xs text-white/70 mb-2">PW Type</Label>
          <Select
            value={watch(typeName) || ""}
            onValueChange={(value) => setValue(typeName, value)}
          >
            <SelectTrigger className="w-full bg-[#FFFFFF0D] border border-black/10 text-white">
              <SelectValue placeholder="Select PW type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fixed</SelectItem>
              <SelectItem value="AGILE">Agile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PW Class */}
        <div className="md:col-span-2">
          <Label className="block text-xs text-white/70 mb-2">PW Class</Label>
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
              onClick={() => append({ pwMin: "", pwMax: "", deviation: "" })}
            >
              + Add PW Row
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
            <span className="text-sm text-white/70">PW Row {index + 1}</span>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="block text-xs text-white/70 mb-1">PW MIN</Label>
              <Input
                {...register(`${tableName}.${index}.pwMin`)}
                className="bg-[#FFFFFF0D] border-black/10 text-white"
              />
            </div>
            <div>
              <Label className="block text-xs text-white/70 mb-1">PW MAX</Label>
              <Input
                {...register(`${tableName}.${index}.pwMax`)}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default PwTable;
