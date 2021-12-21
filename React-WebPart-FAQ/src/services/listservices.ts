import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";

export class listDao {
    public static async getItems(context: WebPartContext, listId: string): Promise<IListItem[]> {
        sp.setup({
            spfxContext: context
        });
        return await sp.web.lists.getById(listId).items.orderBy("Order0").get();
    }
}