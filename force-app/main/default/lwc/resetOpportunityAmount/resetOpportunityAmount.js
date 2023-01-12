import { LightningElement, api } from 'lwc';
import resetOpportunityAmount from '@salesforce/apex/OpportunityAmountReset.resetOpportunityAmount';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import success from '@salesforce/label/c.Success';
import error from '@salesforce/label/c.Error';
import theAmountIsReset from '@salesforce/label/c.TheAmountIsReset';

/*import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';*/

export default class ResetOpportunityAmount extends LightningElement {
    @api recordId;
    label = { success, error, theAmountIsReset };

    @api invoke() {
        resetOpportunityAmount({ opportunityId: this.recordId })
            .then(result => {
                getRecordNotifyChange([{ recordId: this.recordId }]);
                const toastEvent = new ShowToastEvent({
                    title: this.label.success,
                    message: this.label.theAmountIsReset,
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                const toastEvent = new ShowToastEvent({
                    title: this.label.error,
                    message: error.body.message,
                    variant: 'error'
                });
                this.dispatchEvent(toastEvent);
            });
    }

    /*@api invoke() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[AMOUNT_FIELD.fieldApiName] = null;
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                const toastEvent = new ShowToastEvent({
                    title: this.label.success,
                    message: this.label.theAmountIsReset,
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                const toastEvent = new ShowToastEvent({
                    title: this.label.error,
                    message: error.body.message,
                    variant: 'error'
                });
                this.dispatchEvent(toastEvent);
            });
    }*/
}