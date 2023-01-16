import { LightningElement, api, wire } from 'lwc';
import searchContacts from '@salesforce/apex/ContactSearch.searchContacts';

export default class ContactSearchResults extends LightningElement {
    @api searchKey = '';

    @wire(searchContacts, { searchKey: '$searchKey' })
    contacts;
}