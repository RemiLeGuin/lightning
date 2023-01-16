public with sharing class ContactSearch {
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String searchKey) {
        return (List<Contact>) [FIND :searchKey IN NAME FIELDS RETURNING Contact (Name, Id)][0];
    }
}