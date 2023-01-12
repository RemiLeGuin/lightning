public with sharing class OpportunityAmountReset {
    @AuraEnabled(cacheable=false)
    public static void resetOpportunityAmount(Id opportunityId) {
        Opportunity opp = [SELECT Id, Amount FROM Opportunity WHERE Id = :opportunityId WITH SECURITY_ENFORCED LIMIT 1];
        opp.Amount = null;
        update as user opp;
    }
}