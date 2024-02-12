import { StringField } from "./string-field.interface";
import { Tag } from "./tag.interface";

export interface Point {
  tags: Tag[];
  stringFields: StringField[];
}
