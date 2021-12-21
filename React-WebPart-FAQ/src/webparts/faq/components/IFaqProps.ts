import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IFaqProps {
  context: WebPartContext;
  list: string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  iconDisplay: string;
  iconHidden: string;
  titlecolor: string;
}

