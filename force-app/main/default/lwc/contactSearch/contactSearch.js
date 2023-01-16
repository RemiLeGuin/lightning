import { LightningElement } from 'lwc';

export default class ContactSearch extends LightningElement {
    searchKey = '';

    handleSearch(event) {
        this.searchKey = event.detail.searchKey;
    }
}