// ******************************************************************************************************
//  ByUser.tsx - Gbtc
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
import Table from '@gpa-gemstone/react-table';
import { CrossMark } from '@gpa-gemstone/gpa-symbols';
import { SearchBar, Search, Modal } from '@gpa-gemstone/react-interactive';
import { SystemCenter, Application } from '@gpa-gemstone/application-typings';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import UserForm from './UserForm';

interface IProps {
	GetAdditionalUserFields: () => JQuery.jqXHR<Application.Types.AdditionalUserField[]>,
	GetUsers: (filters: Search.IFilter<Application.Types.UserAccount>[], OrderBy: keyof Application.Types.UserAccount, Ascending: boolean) => JQuery.jqXHR<Application.Types.UserAccount[]>,
	OnUserSelect: (id: string) => void,
	AdduserAccount: (user: Application.Types.UserAccount) => JQuery.jqXHR,
	GetSID: (userName: string) => JQuery.jqXHR<string>,
	GetADinfo: (user: Application.Types.UserAccount) => JQuery.jqXHR<Application.Types.UserAccount>,
	GetNewUser: () => JQuery.jqXHR<Application.Types.UserAccount>,
	GetValueList: (group: string) => JQuery.jqXHR<SystemCenter.Types.ValueListItem[]>,
}



const defaultSearchcols: Array<Search.IField<Application.Types.UserAccount>> = [
    { label: 'First Name', key: 'FirstName', type: 'string', isPivotField: false },
    { label: 'Last Name', key: 'LastName', type: 'string', isPivotField: false },
    { label: 'Location', key: 'Location', type: 'string', isPivotField: false },
    { label: 'Phone', key: 'Phone', type: 'string', isPivotField: false },
    { label: 'Email', key: 'Email', type: 'string', isPivotField: false },

];


function ByUser(props: IProps)  {
	const [search, setSearch] = React.useState<Search.IFilter<Application.Types.UserAccount>[]>([]);
  const [searchState, setSearchState] = React.useState<('Idle' | 'Loading' | 'Error')>('Idle');

  const [data, setData] = React.useState<Application.Types.UserAccount[]>([]);
  const [sortField, setSortField] = React.useState<keyof Application.Types.UserAccount>('FirstName');
  const [ascending, setAscending] = React.useState<boolean>(true);

  const [newUserAccount, setNewUserAccount] = React.useState<Application.Types.UserAccount>();
  const [filterableList, setFilterableList] = React.useState<Search.IField<Application.Types.UserAccount>[]>(defaultSearchcols);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [userError, setUserError] = React.useState<string[]>([]);

	React.useEffect(() => {
		let handle = props.GetUsers(search,sortField,ascending);
		handle.done((data: Array<Application.Types.UserAccount>) => {
            if (typeof (data) == 'string') data = JSON.parse(data);
            setData(data);
            setSearchState('Idle');
        });
        handle.fail(msg => setSearchState('Error'))

        return () => { if (handle != null && handle.abort != null) handle.abort(); }
  }, [search, ascending, sortField]);

  React.useEffect(() => {
      let handle = props.GetAdditionalUserFields();

    	handle.done((d: Application.Types.AdditionalUserField[]) => {
        if (typeof (d) == 'string') d = JSON.parse(d);

				function ConvertType(type: string) {
					 if (type == 'string' || type == 'integer' || type == 'number' || type == 'datetime' || type == 'boolean')
							 return { type: type }
					 return { type: 'enum', enum: [{ Label: type, Value: type }] }
	 			}
        let ordered = _.orderBy(defaultSearchcols.concat(d.map(item => (
            { label: `[AF] ${item.FieldName}`, key: item.FieldName, ...ConvertType(item.Type) } as Search.IField<Application.Types.UserAccount>
        ))), ['label'], ["asc"]);
        setFilterableList(ordered)
    });
      return () => {
          if (handle.abort != null) handle.abort();
      }
  }, []);

  React.useEffect(() => {
      let handle = props.GetNewUser();
      handle.done((ua) => setNewUserAccount(ua))
      return () => {
          if (handle.abort != null) handle.abort();
      }
  }, []);

	function addNewUserAccount() {
		if (newUserAccount === undefined)
			return
      props.AdduserAccount({...newUserAccount, Password: CryptoJS.SHA256(newUserAccount.Password + "0").toString(CryptoJS.enc.Base64) }).always(() => {
            setSearch((s) => [...s]);
        });
    }

		return (
         <div style={{ width: '100%', height: '100%' }}>
             <SearchBar<Application.Types.UserAccount> CollumnList={filterableList} SetFilter={(flds) => setSearch(flds)}
						 Direction={'left'} defaultCollumn={{ label: 'Last Name', key: 'LastName', type: 'string', isPivotField: false }} Width={'50%'} Label={'Search'}
                 ShowLoading={searchState == 'Loading'} ResultNote={searchState == 'Error' ? 'Could not complete Search' : 'Found ' + data.length + ' UserAccounts'}
                 GetEnum={(setOptions, field) => {

                     if (field.type != 'enum' || field.enum == undefined || field.enum.length != 1)
                         return () => { };

                     const handle = props.GetValueList(field.enum[0].Value)

                     handle.done(d => setOptions(d.map(item => ({ Value: item.ID.toString(), Label: item.Value }))))
                     return () => { if (handle != null && handle.abort == null) handle.abort(); }
                 }}

             >
                 <li className="nav-item" style={{ width: '15%', paddingRight: 10 }}>
                     <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                         <legend className="w-auto" style={{ fontSize: 'large' }}>Actions:</legend>
                         <form>
                             <button className="btn btn-primary" onClick={(event) => { event.preventDefault(); setShowModal(true) }}>Add User</button>
                         </form>
                     </fieldset>
                 </li>
             </SearchBar>

             <div style={{ width: '100%', height: 'calc( 100% - 136px)' }}>
                 <Table<Application.Types.UserAccount>
                     cols={[
                         { key: 'Name', field: 'Name', label: 'User Name', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                         { key: 'FirstName', field: 'FirstName', label: 'First Name', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                         { key: 'LastName', field: 'LastName', label: 'Last Name', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                         { key: 'Phone', field: 'Phone', label: 'Phone', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                         { key: 'Email', field: 'Email', label: 'Email', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
                         { key: 'scroll', label: '', headerStyle: { width: 17, padding: 0 }, rowStyle: { width: 0, padding: 0 } },
                     ]}
                     tableClass="table table-hover"
                     data={data}
                     sortKey={sortField}
                     ascending={ascending}
                     onSort={(d) => {
											 if (d.colKey == 'sort')
											 	return;
                       if (d.colKey !== sortField)
                           setAscending(!ascending);
                       else {
                           setAscending(true);
                           setSortField(d.colKey);
                       }

                     }}
                     onClick={(d) => props.OnUserSelect(d.row.ID)}
                     theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                     tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%' }}
                     rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                     selected={(item) => false}
                 />
             </div>
             <Modal Show={showModal} Size={'lg'} ShowCancel={false} ShowX={true} ConfirmText={'Save'}
                 Title={'Add User'} CallBack={(confirm) => {
                     if (confirm)
                         addNewUserAccount();
                     props.GetNewUser().done(nua => setNewUserAccount(nua));

                     setShowModal(false);
                 }}
                 ConfirmShowToolTip={userError.length > 0}
                 ConfirmToolTipContent={userError.map((t, i) => <p key={i}>{CrossMark} {t}</p>)}
                 DisableConfirm={userError.length > 0}
             >
						 {newUserAccount !== undefined?   <UserForm
							  UserAccount={newUserAccount} Setter={setNewUserAccount}
								Edit={false} SetErrors={setUserError}
								GetSID={props.GetSID} GetADinfo={props.GetADinfo}
								/> : null }
             </Modal>
         </div>
     )

}

export default ByUser;
