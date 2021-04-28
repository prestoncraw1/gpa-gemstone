// ******************************************************************************************************
//  Setting.tsx - Gbtc
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
//  04/28/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import { Input } from '@gpa-gemstone/react-forms';
import Table from '@gpa-gemstone/react-table';
import { CrossMark } from '@gpa-gemstone/gpa-symbols';
import { SearchBar, Search, Modal, Warning } from '@gpa-gemstone/react-interactive';

interface S {
	Value: string,
	Name: string,
	DefaultValue: string
}
interface IProps<T extends S> {
    getNewSetting: () => T,
    searchSetting: (search: Search.IFilter<T>[], ascending: boolean, sortField: string) => JQuery.jqXHR<string>,
    addSetting: (setting: T) => JQuery.jqXHR;
    updateSetting: (setting: T) => JQuery.jqXHR;
    deleteSetting: (setting: T) => JQuery.jqXHR;
}



function Setting<T extends S>(props: IProps<T>)  {

    const [search, setSearch] = React.useState<Search.IFilter<T>[]>([]);
    const [searchState, setSearchState] = React.useState<('Idle' | 'Loading' | 'Error')>('Idle');

    const [data, setData] = React.useState<T[]>([]);
    const [sortField, setSortField] = React.useState<string>('Name');
    const [ascending, setAscending] = React.useState<boolean>(true);
    const [editnewSetting, setEditNewSetting] = React.useState<T>(props.getNewSetting());
    const [editNew, setEditNew] = React.useState<'Edit' | 'New'>('New');

    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [showWarning, setShowWarning] = React.useState<boolean>(false);
    const [hasChanged, setHasChanged] = React.useState<boolean>(false);

    const [triggerReload, setTriggerReload] = React.useState<number>(0);

    React.useEffect(() => {
        setEditNewSetting(props.getNewSetting());

    }, []);

    React.useEffect(() => {
        setSearchState('Loading');
        const handle = props.searchSetting(search, ascending, sortField);
        handle.done((d: string) => { setData(JSON.parse(d) as T[]); setSearchState('Idle'); });
        handle.fail(msg => setSearchState('Error'))

        return () => { if (handle != null && handle.abort != null) handle.abort(); }
    }, [search, ascending, sortField, triggerReload]);

    React.useEffect(() => { setHasChanged(false) }, [showModal]);

    function isValidSetting() {
        return editnewSetting != null && editnewSetting.Name != null && editnewSetting.Name.length > 0
            && editnewSetting.Value != null && editnewSetting.Value.length > 0;
    }

    const searchFields: Search.IField<T>[] = [
        { key: 'Name', label: 'Name', type: 'string' },
        { key: 'DefaultValue', label: 'Default Value', type: 'string' },
        { key: 'Value', label: 'Value', type: 'string' }
    ]

    return (
        <>
        <div style={{ width: '100%', height: '100%' }}>
            <SearchBar<T> CollumnList={searchFields} SetFilter={(flds) => setSearch(flds)} Direction={'left'} defaultCollumn={{ key: 'Name', label: 'Name', type: 'string'}} Width={'50%'} Label={'Search'}
                ShowLoading={searchState === 'Loading'} ResultNote={searchState === 'Error' ? 'Could not complete Search' : 'Found ' + data.length + ' Settings'}
                GetEnum={(setOptions, field) => {
                    return () => { 
						// do nothing.
					}
                }}
            >
                <li className="nav-item" style={{ width: '15%', paddingRight: 10 }}>
                    <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                        <legend className="w-auto" style={{ fontSize: 'large' }}>Actions:</legend>
                        <form>
                                <button className="btn btn-primary" onClick={(event) => { setEditNewSetting(props.getNewSetting()); setEditNew('New'); setShowModal(true); event.preventDefault()}}>Add Setting</button>
                        </form>
                    </fieldset>
                </li>
            </SearchBar>

            <div style={{ width: '100%', height: 'calc( 100% - 136px)' }}>
                <Table<T>
                    cols={[
                        { key: 'Name' as keyof(T), label: 'Setting Name', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                        { key: 'Value' as keyof (T), label: 'Current Value', headerStyle: { width: '10%' }, rowStyle: { width: '10%' } },
                        { key: 'DefaultValue' as keyof (T), label: 'Default Value', headerStyle: { width: '20%' }, rowStyle: { width: '20%' } },
                        { key: null, label: '', headerStyle: { width: 17, padding: 0 }, rowStyle: { width: 0, padding: 0 } },
                    ]}
                    tableClass="table table-hover"
                    data={data}
                    sortField={sortField}
                    ascending={ascending}
                    onSort={(d) => {
                        if (d.col === sortField)
                            setAscending(!ascending);
                        else {
                            setAscending(true);
                            setSortField(d.col as string);
                        }

                    }}
                        onClick={(item) => { setEditNewSetting(item.row); setShowModal(true); setEditNew('Edit');}}
                    theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                    tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%' }}
                    rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                    selected={(item) => false}
                />
            </div>
            </div>
            <Modal Title={editNew === 'Edit' ? editnewSetting.Name + ' - Setting' : 'Add New Setting'}
                Show={showModal} ShowX={true} Size={'lg'} ShowCancel={editNew === 'Edit'} ConfirmText={'Save'}
                CallBack={(conf, isBtn) => {
                    if (conf && editNew === 'New')
                        props.addSetting(editnewSetting).then((d) => setTriggerReload((x) => x + 1));
                    if (conf && editNew === 'Edit')
                        props.updateSetting(editnewSetting).then((d) => setTriggerReload((x) => x + 1));
                    if (!conf && isBtn)
                        setShowWarning(true);
                    
                    setShowModal(false);
                }}
                DisableConfirm={(editNew === 'Edit' && !hasChanged) || !isValidSetting()}
                ConfirmShowToolTip={!isValidSetting()}
                ConfirmToolTipContent={[
                    editnewSetting.Name == null || editnewSetting.Name.length === 0 ? <p key={1}>{CrossMark} A Name is required.</p> : null,
                    editnewSetting.Value == null || editnewSetting.Value.length === 0 ? <p key={2}>{CrossMark} A Value is required. </p> : null,
                ]}
            >
                <div className="row">
                    <div className="col">
                        <Input<T> Record={editnewSetting} Field={'Name' as keyof (T)} Label='Setting Name' Feedback={'A unique Name is required.'}
                            Valid={field => editnewSetting.Name != null && editnewSetting.Name.length > 0}
                            Setter={(record: T) => { setEditNewSetting(record); setHasChanged(true); }} />
                        <Input<T> Record={editnewSetting} Field={'Value' as keyof (T)} Label='Value' Feedback={'Value is required.'}
                            Valid={field => editnewSetting.Value != null && editnewSetting.Value.length > 0}
                            Setter={(record: T) => { setEditNewSetting(record); setHasChanged(true); }} />
                        <Input<T> Record={editnewSetting} Field={'DefaultValue' as keyof (T)} Label='Default Value' Valid={field => true} Setter={(record: T) => { setEditNewSetting(record); setHasChanged(true); }}  />
                    </div>
                </div>
            </Modal>
            <Warning Title={'Delete Setting'} Message={'This will Delete this Setting from the System. this can have unintended consequences and cause the System to crash are you Sure you want to continue?.'}
                Show={showWarning} CallBack={(conf) => { if (conf) props.deleteSetting(editnewSetting).then((d) => setTriggerReload((x) => x + 1)); setShowWarning(false); }} />
            </>
        )
}

export default Setting;