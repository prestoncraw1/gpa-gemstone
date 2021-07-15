// ******************************************************************************************************
//  UserPermission.tsx - Gbtc
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
import { Application } from '@gpa-gemstone/application-typings';
import * as _ from 'lodash';
import { CheckBox } from '@gpa-gemstone/react-forms';

interface IProps {
	User: Application.Types.UserAccount,
	GetAllRoles: () => JQuery.jqXHR<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]>,
	GetActiveRoles: (userID: string) => JQuery.jqXHR<Application.Types.iApplicationRoleUserAccount[]>,
	SetRoles: (roles: Application.Types.iApplicationRoleUserAccount[]) => JQuery.jqXHR

}

function UserPermission(props: IProps)  {
	const [roles, setRoles] = React.useState<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]>([]);
	const [currentRoles, setCurrentRoles] = React.useState<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]>([]);
  const [changed, setChanged] = React.useState<boolean>(false);
  const [counter, setCounter] = React.useState<number>(0);

	React.useEffect(() => {
		const handle = props.GetAllRoles();
		handle.then((d) => {
			setRoles(d);
			setCounter((x) => x + 1)

		})
		return () => { if (handle != null && handle.abort != null) handle.abort(); }
	},[]);

	React.useEffect(() => {
		setChanged(false);
		const handle = props.GetActiveRoles(props.User.ID);
		handle.then((d) => {
			setCurrentRoles(roles.map(src => {
				 src.Assigned = d.find(usrc => usrc.ApplicationRoleID == src.ID) != undefined;
				 return src;
		 }));

		})
		return () => { if (handle != null && handle.abort != null) handle.abort(); }
	}, [counter]);

	return (
        <div className="card" style={{ marginBottom: 10 }}>
            <div className="card-header">
                <div className="row">
                    <div className="col">
                        <h4>User Permissions:</h4>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                            <legend className="w-auto" style={{ fontSize: 'large' }}>System Center:</legend>
                            <form>
                                {
                                    currentRoles.map((scr, i, array) => <CheckBox<Application.Types.iApplicationRole<Application.Types.SecurityRoleName>> key={scr.ID} Record={scr} Field='Assigned' Label={scr.Name} Setter={(record) => {
                                        scr.Assigned = record.Assigned;
                                        let newArray = _.clone(array);
                                        setCurrentRoles(newArray);
                                        setChanged(true);
                                    }} />)
                                }
                            </form>
                        </fieldset>
                    </div>
                    <div className="col">
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="btn-group mr-2">
                    <button className="btn btn-primary" onClick={() => props.SetRoles(currentRoles.filter(scr => scr.Assigned).map(scr => ({ ID: '00000000-0000-0000-0000-000000000000', ApplicationRoleID: scr.ID, UserAccountID: props.User.ID }))).then(() => setCounter((x) => x + 1))} disabled={!changed}>Update</button>
                </div>
                <div className="btn-group mr-2">
                    <button className="btn btn-default" onClick={() => setCounter((x) => x + 1)} disabled={!changed}>Reset</button>
                </div>
            </div>
        </div>
    );


}

export default UserPermission;
