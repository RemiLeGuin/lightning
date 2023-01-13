import { LightningElement, api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import OPPORTUNITY_ID_FIELD from '@salesforce/schema/Opportunity.Id';
import OPPORTUNITY_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPPORTUNITY_ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Account.Id';
import ACCOUNT_RATING_FIELD from '@salesforce/schema/Account.Rating';
import ERROR_LABEL from '@salesforce/label/c.Error';

const OPPORTUNITY_FIELDS = [OPPORTUNITY_AMOUNT_FIELD, OPPORTUNITY_ACCOUNTID_FIELD];
const ACCOUNT_FIELDS = [ACCOUNT_RATING_FIELD];

export default class UpdateOpportunityAndAccount extends LightningElement {
    @api recordId;
    @track error;
    _newOpportunityAmount;
    _newAccountRating;

    @wire(getRecord, { recordId: '$recordId', fields: OPPORTUNITY_FIELDS })
    opportunity;

    get opportunityAmount() {
        return getFieldValue(this.opportunity.data, OPPORTUNITY_AMOUNT_FIELD);
    }

    get opportunityAccountId() {
        return getFieldValue(this.opportunity.data, OPPORTUNITY_ACCOUNTID_FIELD);
    }

    @wire(getRecord, { recordId: '$opportunityAccountId', fields: ACCOUNT_FIELDS })
    account;

    get accountRating() {
        return getFieldValue(this.account.data, ACCOUNT_RATING_FIELD);
    }

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountObjectInfo;

    accountRatingPicklistValues;
    @wire(getPicklistValues, { recordTypeId: '$accountObjectInfo.data.defaultRecordTypeId', fieldApiName: ACCOUNT_RATING_FIELD })
    wiredAccountRatingPicklistValues({ error, data }) {
        if (error) {
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
        } else if (data) {
            this.accountRatingPicklistValues = data.values;
        }
    }

    handleAmountChange(event) {
        this._newOpportunityAmount = event.detail.value;
    }

    handleRatingChange(event) {
        this._newAccountRating = event.detail.value;
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    async handleSubmit() {
        try {
            await this.updateOpportunity();
            await this.updateAccount();
            this.dispatchEvent(new CloseActionScreenEvent());
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_LABEL,
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    updateOpportunity() {
        const fields = {};
        fields[OPPORTUNITY_ID_FIELD.fieldApiName] = this.recordId;
        fields[OPPORTUNITY_AMOUNT_FIELD.fieldApiName] = this._newOpportunityAmount;
        const recordInput = { fields };
        updateRecord(recordInput);
    };

    updateAccount() {
        const fields = {};
        fields[ACCOUNT_ID_FIELD.fieldApiName] = this.opportunityAccountId;
        fields[ACCOUNT_RATING_FIELD.fieldApiName] = this._newAccountRating;
        const recordInput = { fields };
        updateRecord(recordInput);
    };
}