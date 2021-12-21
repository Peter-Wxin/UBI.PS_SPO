import { DisplayMode } from "@microsoft/sp-core-library";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import * as strings from 'FaqWebPartStrings';
import { IconButton } from 'office-ui-fabric-react';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import * as React from 'react';
import { listDao } from '../../../services/listservices';
import styles from './Faq.module.scss';
import { IFaqProps } from './IFaqProps';
import { IFaqState } from './IFaqState';

export default class Faq extends React.Component<IFaqProps, IFaqState> {

  constructor(props: IFaqProps) {
    super(props);

    this.state = {
      allItems: [],
      items: [],
      error: false
    };
  }

  private async getItems() {
    const _items = (await listDao.getItems(this.props.context, this.props.list)).map(item => {
      item.Collapse = true;
      return item;
    });
    let _error: boolean = true;

    if (_items && _items.length > 0) {
      _error = false;
    }
    this.setState({
      allItems: _items,
      items: _items,
      error: _error
    });
  }

  private searchItems = (newValue: string) => {
    if (newValue === undefined || newValue === null || newValue === "" || newValue.length < 2) {
      this.setState({
        items: this.state.allItems
      });
    }
    else {
      let _items: IListItem[] = this.state.allItems.filter((item: IListItem) => {
        return item.Title.toLowerCase().search(newValue.toLowerCase()) !== -1 ||
          item.Details.toLowerCase().search(newValue.toLowerCase()) !== -1;
      });
      this.setState({
        items: _items
      });
    }
  }

  private onClickTitle = (item: IListItem) => {
    item.Collapse = !item.Collapse;

    this.setState({
      items: this.state.items
    });
  }

  private displayItem(): JSX.Element[] {
    if (this.state.items.length == 0) {
      this.getItems();
    }
    return this.state.items.map((item: IListItem, i: number): JSX.Element => {
      return (
        <div className={styles.items}>
          <div className={styles.topBar} onClick={() => this.onClickTitle(item)} style={{ background: this.props.titlecolor }}>
            <Image
              src={item.Icon.Url}
              alt={item.Icon.Description}
              height={40}
            />
            <div className={styles.title}>
              {item.Title}
            </div>
            <div className={styles.actionOpen}>
              <FontIcon iconName={item.Collapse ? this.props.iconDisplay : this.props.iconHidden} />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: item.Details }} className={styles.details} hidden={item.Collapse}>
          </div>
        </div>
      );
    });
  }

  private expandAll = () => {
    let _items: IListItem[] = this.state.items.map((item: IListItem) => {
      item.Collapse = false;
      return item;
    });

    this.setState({
      items: _items
    });
  }

  private collapseAll = () => {
    let _items: IListItem[] = this.state.items.map((item: IListItem) => {
      item.Collapse = true;
      return item;
    });

    this.setState({
      items: _items
    });
  }

  private optionBar(): JSX.Element {
    return (
      <div className={styles.actionBar}>
        <div className={styles.search}>
          <SearchBox
            placeholder={strings.FilterText}
            iconProps={{ iconName: 'Filter' }}
            onChange={this.searchItems}
          />
        </div>
        <div className={styles.actions}>
          <IconButton iconProps={{ iconName: this.props.iconDisplay }} title={strings.ShowAllCallout} onClick={this.expandAll} />
          <IconButton iconProps={{ iconName: this.props.iconHidden }} title={strings.HideAllCallout} onClick={this.collapseAll} />
        </div>
      </div>
    );
  }

  private _onConfigure = () => {
    this.props.context.propertyPane.open();
  }

  public render(): React.ReactElement<IFaqProps> {
    <div>hello </div>
    if (this.state.error)
      return (
        <div>error</div>
      );
    else if (!this.props.list)
      return (
        <Placeholder iconName='Edit'
          iconText='Configure your web part'
          description='Please configure the web part.'
          buttonLabel='Configure'
          hideButton={this.props.displayMode === DisplayMode.Read}
          onConfigure={this._onConfigure} />
      );
    else
      return (
        <div className={styles.faq}>
          <WebPartTitle displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.updateProperty} />
          {this.optionBar()}
          {this.displayItem()}
        </div>
      );
  }
}
