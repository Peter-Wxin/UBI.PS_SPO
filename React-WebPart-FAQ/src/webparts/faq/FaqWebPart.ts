import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, IWebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'FaqWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Faq from './components/Faq';
import { IFaqProps } from './components/IFaqProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { DisplayMode } from '@microsoft/sp-core-library';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldTextWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldTextWithCallout';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import { update, get } from '@microsoft/sp-lodash-subset';

export interface IFaqWebPartProps {
  list: string;
  title: string;
  displayMode: DisplayMode;
  gulp: (value: string) => void;
  iconDisplay: string;
  iconHidden: string;
  titlecolor: string;
}

export default class FaqWebPart extends BaseClientSideWebPart<IFaqWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFaqProps> = React.createElement(
      Faq,
      {
        context: this.context,
        list: this.properties.list,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        iconDisplay: this.properties.iconDisplay,
        iconHidden: this.properties.iconHidden,
        titlecolor: this.properties.titlecolor
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyFieldListPicker('list', {
                  label: strings.ListSelect,
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onListChange.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldTextWithCallout('iconDisplay', {
                  calloutTrigger: CalloutTriggers.Click,
                  key: 'iconDisplayId',
                  label: strings.IconDisplaySelect,
                  calloutContent: React.createElement('span', {}, strings.OfficeUiFabricIconeCallout),
                  calloutWidth: 230,
                  value: this.properties.iconDisplay,
                  placeholder : "Down"
                }),
                PropertyFieldTextWithCallout('iconHidden', {
                  calloutTrigger: CalloutTriggers.Click,
                  key: 'IconHiddenId',
                  label: strings.IconHiddenSelect,
                  calloutContent: React.createElement('span', {}, strings.OfficeUiFabricIconeCallout),
                  calloutWidth: 230,
                  value: this.properties.iconHidden,
                  placeholder : "Up"
                }),
                PropertyFieldColorPicker('titlecolor', {
                  label: strings.TitlecolorSelect,
                  selectedColor: this.properties.titlecolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Precipitation',
                  key: 'colorFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
