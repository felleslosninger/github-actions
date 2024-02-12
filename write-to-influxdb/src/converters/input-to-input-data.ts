import { InputData } from "../interfaces/input-data";

export function toInputData(jsonAsString: string): InputData {
  const jsonObject = JSON.parse(jsonAsString);

  return jsonObject as InputData;
}
