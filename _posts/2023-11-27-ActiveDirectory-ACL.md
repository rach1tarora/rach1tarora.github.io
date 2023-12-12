---
layout: post
title:  "Active Directory: ACLs"
date:   2023-11-27 07:29:20 +0700
tags: [defence,ad]
categories: jekyll update
usemathjax: true
---

## **Access Control List Model ( ACL )**

Enables control on the ability of a process to access objects and other resources in active directory based on:

1. Access Token
a. Security Context of a process
b. Identitiy and privs of user
2. Security Descriptors
- SID of **principal** that is the object owner
- SID of the owner **primary group**
- (Optional) **DACL** (Discretionary Access Control List)
- (Optional) **SACL** (System Access Control List)

```powershell
PS C:\> $(Get-ADUser anakin -Properties nTSecurityDescriptor).nTSecurityDescriptor | select Owner,Gro
up,Access,Audit | Format-List

Owner  : CONTOSO\Domain Admins
Group  : CONTOSO\Domain Admins
Access : {System.DirectoryServices.ActiveDirectoryAccessRule, System.DirectoryServices.ActiveDirectoryAccessRule,
         System.DirectoryServices.ActiveDirectoryAccessRule, System.DirectoryServices.ActiveDirectoryAccessRule...}
Audit  :
```

An ACL is a list of ACEs (Access Control Entry). The
ACEs of the SACL defines the access attempts that are going to [generate logs](https://docs.microsoft.com/en-us/windows/win32/secauthz/audit-generation),
and they can be useful from a defensive perspective.

However, the most important part is the DACL, that is usually present in all the
objects, whose ACEs determines the users/groups that can access to the object,
and the type of access that is allowed. Usually when someone refers to the
object ACL, it means the DACL

<br>

## DACL

 Defines the permissions trustees (a user or group) have on an object.

![https://media.discordapp.net/attachments/928373179003600907/1175722504271179846/image.png?ex=656c43e8&is=6559cee8&hm=dee0c8ca693c460627efcc1c8544e5f1b9a809a8fdec347dbae90d7a05a95fe0&=&width=1200&height=651](https://media.discordapp.net/attachments/928373179003600907/1175722504271179846/image.png?ex=656c43e8&is=6559cee8&hm=dee0c8ca693c460627efcc1c8544e5f1b9a809a8fdec347dbae90d7a05a95fe0&=&width=1200&height=651)

### DACL Structure

The access control list consists of multiple individual permissions known as **ACEs** Access Control Entries. 

Each entry has a permission type (allow or deny), a principal account (who is this permission for — *user, group, computer*), what objects the principal account can access, and the access rights [*read, write, Full Control*].

![https://cdn.discordapp.com/attachments/928373179003600907/1175722685796466739/image.png?ex=656c4414&is=6559cf14&hm=f3575a6f518d4900a7c706b6511893566c4711aa93661ce9f0401b85671bcb5c&](https://cdn.discordapp.com/attachments/928373179003600907/1175722685796466739/image.png?ex=656c4414&is=6559cf14&hm=f3575a6f518d4900a7c706b6511893566c4711aa93661ce9f0401b85671bcb5c&)

<br>

### SACL

SACL - Logs success and failure audit messages when an object is accessed.

![https://media.discordapp.net/attachments/928373179003600907/1175723100399218708/image.png?ex=656c4477&is=6559cf77&hm=eed21a73721769f8dcac3dc7a89316fbd5541787a8f05047427ca069640a99c7&=&width=969&height=651](https://media.discordapp.net/attachments/928373179003600907/1175723100399218708/image.png?ex=656c4477&is=6559cf77&hm=eed21a73721769f8dcac3dc7a89316fbd5541787a8f05047427ca069640a99c7&=&width=969&height=651)

Every object have Security Descriptors 

![https://cdn.discordapp.com/attachments/928373179003600907/1175723280347447317/image.png?ex=656c44a1&is=6559cfa1&hm=116251d3eefc3ea41016ad478acf82ca21cd20c5108abd64ec628c16c549926a&](https://cdn.discordapp.com/attachments/928373179003600907/1175723280347447317/image.png?ex=656c44a1&is=6559cfa1&hm=116251d3eefc3ea41016ad478acf82ca21cd20c5108abd64ec628c16c549926a&)


<br> 

### ACEs

Each [ACE has several parts](http://web.archive.org/web/20150907161422/http://searchwindowsserver.techtarget.com/feature/The-structure-of-an-ACE):

- **ACE type**: Specifies if the ACE is for allowing or denying access (or
logging access in case of SACL).
- **Inheritance**: Indicates if the ACE is inherited.
- **Principal/Identity**: Indicates the principal (user/group) for which the
ACE is applied. The principal SID is stored.
- **Rights**: Indicates the type of access the ACE is applying.
- **Object type**: A [GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) that indicates an extended right, property, or child
object depending on the Access Mask flags. Is set to zero if not used.
- **Inheritance type**: The type of object class that can inherit the ACE from
this object

![https://cdn.discordapp.com/attachments/928373179003600907/1175724280412123176/image.png?ex=656c4590&is=6559d090&hm=0d892a529f3321ca97f4484cb17e355d6be46a85f2b4b7efef1ffd569cd1684f&](https://cdn.discordapp.com/attachments/928373179003600907/1175724280412123176/image.png?ex=656c4590&is=6559d090&hm=0d892a529f3321ca97f4484cb17e355d6be46a85f2b4b7efef1ffd569cd1684f&)

```powershell
PS C:\Users\Administrator> $(Get-ADUser anakin -Properties nTSecurityDescriptor).nTSecurityDescriptor.Access[0]

ActiveDirectoryRights : GenericRead
InheritanceType       : None
ObjectType            : 00000000-0000-0000-0000-000000000000
InheritedObjectType   : 00000000-0000-0000-0000-000000000000
ObjectFlags           : None
AccessControlType     : Allow
IdentityReference     : NT AUTHORITY\SELF
IsInherited           : False
InheritanceFlags      : None
PropagationFlags      : None
```

On the other hand, **ACEs can be inherit from parent objects** of the database (OUs
and containers), and actually, most of the ACEs that apply to objects are
inherited. In case of a inherited access contradicts an explicit ACE (not
inherited), then the explicit ACE determines the access rule. Thus, the
precedence is the following for ACEs:

1. Explicit deny ACE
2. Explicit allow ACE
3. Inherited deny ACE
4. Inherited allow ACE


<br>

### **Active Directory object permissions**

Some of the Active Directory object permissions and types that we as attackers are **interested** in:

**GenericAll** - full rights to the object (add users to a group or reset user's password)

**GenericWrite** - update object's attributes (i.e logon script)

**WriteOwner** - change object owner to attacker controlled user take over the object

**WriteOwner** - change object owner to attacker controlled user take over the object

**AllExtendedRights** - ability to add user to a group or reset password

**ForceChangePassword** - ability to change user's password

**Self (Self-Membership)** - ability to add yourself to a group


<br>

There are many [extended rights](https://docs.microsoft.com/en-us/windows/win32/adschema/extended-rights), but here are ones of the most :

- [User-Force-Change-Password](https://docs.microsoft.com/en-us/windows/win32/adschema/r-user-force-change-password): Change the user password without knowing the
current password. For user objects. Do not confuse with [User-Change-Password](https://docs.microsoft.com/en-us/windows/win32/adschema/r-user-force-change-password)
right, that requires to know the password to change it.
- [DS-Replication-Get-Changes](https://docs.microsoft.com/en-us/windows/win32/adschema/r-ds-replication-get-changes): To replicate the database data. For the domain
object. Required to perform dcsync.
- [DS-Replication-Get-Changes-All](https://docs.microsoft.com/en-us/windows/win32/adschema/r-ds-replication-get-changes-all): To replicate the database secret data. For the
domain object. Required to perform dcsync

<br>

## **ACL attacks**

1. Change the user password

2. Make user Kerberoasteable

3. Execute malicious script

4. Add users to group

5. [DCSync attack](https://adsecurity.org/?p=1729):

6. [LAPS password](https://adsecurity.org/?p=3164)

7. Modify ACLs

8. GPO abuse


**There are more, would be writing a different blog for that**


## **Enumerating ACLs**

```powershell
# The GUID resolver parameter gets the group ID of the requested object.
Get-DomainObjectAcl -SamAccountName studentl -ResolveGUIDs


# Get the ACLs associated with the specified prefix to be used for search
Get-DomainObjectAcl -SearchBase "LDAP://CN=Domain Admins,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local" -ResolveGUIDs -Verbose



# Check the Domain Admins permission - PowerView as normal use
Get-DomainObjectAcl -Identity 'Domain Admins' - ResolveGUIDs | ForEach-Object {$_ | Add-Member NoteProperty 'IdentityName' $(Convert-SidToName $_.SecurityIdentifier);$_} |  {$_.IdentityName -match "student1"}
# ActiveDirectory Module
(Get-Acl -Path 'AD:\CN=Domain Admins,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local').Access | ?{$_.IdentityReference -match 'student1'}


# We can also enumerate ACLs using ActiveDirectory module but without resolving GUIDs (ADModule)
(Get-Acl 'AD:\CN=Administrator,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local').Access

#To filter through a specific type of permission, use the equal (-eq) operator and pass it the permission type such as “GenericAll.
Get-ObjectAcl student181 | Where-Object ActiveDirectoryRights -eq "GenericAll"
Get-ObjectAcl student181 | select IdentityReference, ActiveDirectoryRights | Where-Object ActiveDirectoryRights -eq "GenericAll"


# Search for interesting ACEs
Find-InterestingDomainAcl -ResolveGUIDs


Get-PathAcl -Path "\\dcorp-dc.dollarcorp.moneycorp.local\sysvol"


# Get The ACLs associated with specified LDAP path
Get-ObjectAcl -ADSpath "LDAP://CN=Domain Admins, CN=Users, DC=dollarcorp, DC=monycorp, DC=local" -ResolveGUIDS -Verbose

#Search For Interesting ACEs
Invoke-ACLScanner -ResolveGUIDS 
Invoke-ACLScanner -ResolveGUIDS | ?{$_.IdentityReferenceName -match "RDPUsers"}

Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "RDPUsers"}
Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "studentx"}
```



<br>

> ### AdminSDHolder

AdminSDHolder is an special object in the database whose DACL is used as template for the security descriptor of privileged principals.

Every 60 minutes, the SDProp (Security Descriptor Propagator) examines the security descriptor of these privileged principals, and replace their DACL with
a copy of AdminSDHolder DACL (if they differ). This is done in order to prevent modifications on the DACLs of these principals, but if you are [able to add custom ACEs](https://adsecurity.org/?p=1906) to the AdminSDHolder DACL, then these new ACEs will also
being applied to the protected principal

By default the following principals are "protected" by AdminSDHolder:

- [Account Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#account-operators)
- Administrator
- [Administrators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#administrators)
- [Backup Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#backup-operators)
- [Domain Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#domain-admins)
- [Domain Controllers](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#domain-controllers)
- [Domain Guests](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#domain-guests)
- [Enterprise Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#enterprise-admins)
- [Enterprise Key Admins](https://zer1t0.gitlab.io/posts/attacking_ad/Enterprise%20Key%20Admins)
- [Enterprise Read-Only Domain Controllers](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#enterprise-read-only-domain-controllers)
- [Key Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#key-admins)
- krbtgt
- [Print Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#print-operators)
- [Read-only Domain Controllers](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#enterprise-read-only-domain-controllers)
- [Replicator](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#replicator)
- [Schema Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#schema-admins)
- [Server Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#server-operators)

> ### Privileges

In Active Directory, [some privileges can be also abused](https://adsecurity.org/?p=3700) (mainly in the Domain
Controllers):

1. SeEnableDelegationPrivilege

2. SeBackupPrivilege

3. SeRestorePrivilege

4. SeTakeOwnershipPrivilege

5. SeDebugPrivilege

6. SeImpersonatePrivilege

check the [token-priv](https://github.com/hatRiot/token-priv) repository of FoxGlove that includes a paper describing them and PoCs to exploit them, highly recommended resource.

<br>
<br>

> Additional resources

https://www.harmj0y.net/blog/

https://zer1t0.gitlab.io/posts/attacking_ad/

https://dirkjanm.io/

https://adsecurity.org/