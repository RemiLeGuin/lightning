import { LightningElement, api } from 'lwc';

export default class ContactSearchInput extends LightningElement {
    @api label = 'Search for contacts';

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            let searchKey = event.target.value;
            let searchEvent = new CustomEvent('search', {
                detail: { searchKey }
            });
            this.dispatchEvent(searchEvent);
        }
    }
}