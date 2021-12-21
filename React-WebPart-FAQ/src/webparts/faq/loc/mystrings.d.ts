declare interface IFaqWebPartStrings {
  PropertyPaneDescription: string;
  ListSelect: string;
  IconDisplaySelect: string;
  IconHiddenSelect: string;
  TitlecolorSelect: string;
  OfficeUiFabricIconeCallout: string;
  ShowAllCallout: string;
  HideAllCallout: string;
  FilterText: string;
}

declare module 'FaqWebPartStrings' {
  const strings: IFaqWebPartStrings;
  export = strings;
}
