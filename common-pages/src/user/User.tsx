// ******************************************************************************************************
//  User.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  07/14/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { TabSelector, Warning } from '@gpa-gemstone/react-interactive';
import { Application, SystemCenter } from '@gpa-gemstone/application-typings';
import * as _ from 'lodash';
import UserInfo from './UserInfo';
import UserPermissions from './UserPermissions';
import AdditionalField from './AdditionalField'

interface IProps {
	UserID: string,
	GetUser: (UserID: string) => JQuery.jqXHR<Application.Types.UserAccount>,
	DeleteUser: (user: Application.Types.UserAccount) => JQuery.jqXHR,
	OnDelete: () => {};
	UpdateUser: (user: Application.Types.UserAccount) => JQuery.jqXHR,
	GetSID: (userName: string) => JQuery.jqXHR<string>,
	GetADinfo: (user: Application.Types.UserAccount) => JQuery.jqXHR<Application.Types.UserAccount>,
	GetAllRoles: () => JQuery.jqXHR<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]>,
	GetActiveRoles: (userID: string) => JQuery.jqXHR<Application.Types.iApplicationRoleUserAccount[]>,
	SetRoles: (roles: Application.Types.iApplicationRoleUserAccount[]) => JQuery.jqXHR

	GetAdditionalUserFields: () => JQuery.jqXHR<Application.Types.AdditionalUserField[]>,
	GetFieldValues: (userID: string) => JQuery.jqXHR<Application.Types.AdditionalUserFieldValue[]>,
	AddOrUpdateValues: (data: Application.Types.AdditionalUserFieldValue[])=> JQuery.jqXHR,
	GetFields: (sortKey: string, ascending: boolean) => JQuery.jqXHR<Application.Types.AdditionalUserField[]>,
	GetValueLists: () => JQuery.jqXHR<SystemCenter.Types.ValueListGroup[]>,
	DeleteField: (field: Application.Types.AdditionalUserField) => JQuery.jqXHR,
	UpdateField: (field: Application.Types.AdditionalUserField) => JQuery.jqXHR,
	AddField: (field: Application.Types.AdditionalUserField) => JQuery.jqXHR,
	GetValueListGroup: (group: string) => JQuery.jqXHR<SystemCenter.Types.ValueListItem[]>,
	ValidateFieldName: (fieldName: string) => Promise<boolean>
}

function User(props: IProps)  {
	const [user, setUser] = React.useState<Application.Types.UserAccount>()
	const [tab, setTab] = React.useState<string>('userInfo')

	const [showWarning, setShowWarning] =  React.useState<boolean>(false);

	const [counter,setCounter] = React.useState<number>(0);

	React.useEffect(() => {
		let handle = props.GetUser(props.UserID);
		handle.done((u) => setUser({...u, Name: (u.AccountName !== undefined? u.AccountName : u.Name)}))

		return () => { if (handle != null && handle.abort != null) handle.abort(); }
	}, [counter])

	React.useEffect(() => {
	setCounter((x) => x+1)
	}, [])


	if (user == null) return null;

	const Tabs = [
					 { Id: "userInfo", Label: "User Info" },
					 { Id: "permissions", Label: "Permissions" },
					 { Id: "additionalFields", Label: "Additional Fields" }
			 ];
 return (
             <div style={{ width: '100%', height: window.innerHeight - 63, maxHeight: window.innerHeight - 63, overflow: 'hidden', padding: 15 }}>
                 <div className="row">
                     <div className="col">
                         <h2>{user != null ? `${user.FirstName} ${user.LastName}`  : ''}</h2>
                     </div>
                     <div className="col">
                         <button className="btn btn-danger pull-right" hidden={user == null} onClick={() => setShowWarning(true)}>Delete User</button>
                     </div>
                 </div>

                 <hr />
                 <TabSelector CurrentTab={tab} SetTab={(t) => setTab(t)} Tabs={Tabs} />
                 <div className="tab-content" style={{maxHeight: window.innerHeight - 235, overflow: 'hidden' }}>
                     <div className={"tab-pane " + (tab == "userInfo" ? " active" : "fade")} id="userInfo">
                         <UserInfo User={user} stateSetter={(record) => props.UpdateUser(record).then(() =>setCounter((x) => x+1) )} GetSID={props.GetSID} GetADinfo={props.GetADinfo}/>
                     </div>
                     <div className={"tab-pane " + (tab == "permissions" ? " active" : "fade")} id="permissions">
                         <UserPermissions User={user} GetAllRoles={props.GetAllRoles} GetActiveRoles={props.GetActiveRoles} SetRoles={props.SetRoles}/>
                     </div>
                     <div className={"tab-pane " + (tab == "additionalFields" ? " active" : "fade")} id="additionalFields" style={{ maxHeight: window.innerHeight - 215 }}>
                         <AdditionalField
												 GetFields={props.GetFields}
												 GetValueLists={props.GetValueLists}
												 GetFieldValues={props.GetFieldValues}
												 GetValueListGroup={props.GetValueListGroup}
												 AddField={props.AddField}
												 AddOrUpdateValues={props.AddOrUpdateValues}
												 UpdateField={props.UpdateField}
												 UserID={props.UserID}
												 DeleteField={props.DeleteField}
												 ValidateFieldName={props.ValidateFieldName}
												 Tab={tab}
												 />
                     </div>

                 </div>
								 <Warning Message={'This will permanently remove the User. Are you sure you want to continue?'} Title={'Warning'} Show={showWarning} CallBack={(c) => {
										setShowWarning(false);
									if (c)
										props.DeleteUser(user).done(() => props.OnDelete());
								}}/>
             </div>
         )


}

export default User;
