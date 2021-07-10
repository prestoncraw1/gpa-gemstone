// ******************************************************************************************************
//  Note.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
import { Select, TextArea } from '@gpa-gemstone/react-forms';
import Table from '@gpa-gemstone/react-table';
import { Pencil, TrashCan } from '@gpa-gemstone/gpa-symbols';
import { Modal, LoadingIcon, ToolTip, ServerErrorIcon } from '@gpa-gemstone/react-interactive';
import { OpenXDA } from '@gpa-gemstone/application-typings';
import moment = require('moment');

interface IProps {
		NoteTypes: OpenXDA.Types.NoteType[],
    NoteTags: OpenXDA.Types.NoteTag[],
		NoteApplications: OpenXDA.Types.NoteApplication[],
    GetNotes: (ascending: boolean, sortField: string, ReferenceID?: number) => JQuery.jqXHR<string>,
		MaxHeight: number,
		Title?: string,
		ReferenceTableID?: number,
    AddNote?: (note: OpenXDA.Types.Note) => JQuery.jqXHR,
    UpdateNote?: (note: OpenXDA.Types.Note) => JQuery.jqXHR,
    DeleteNote?: (note: OpenXDA.Types.Note) => JQuery.jqXHR,
}



function Note(props: IProps)  {

  const [showEdit, setEdit] = React.useState<boolean>(false);
	const [sortField, setSortField] = React.useState<string>('Timestamp');
  const [ascending, setAscending] = React.useState<boolean>(false);
	const [hoverAdd, setHoverAdd] = React.useState<boolean>(false);
  const [hoverClear, setHoverClear] = React.useState<boolean>(false);
  const [data, setData] = React.useState<OpenXDA.Types.Note[]>([]);
	const [loadingState, setLoadingState] = React.useState<('Idle' | 'Loading' | 'Error')>('Idle');
	const [note, setNote] = React.useState<OpenXDA.Types.Note>(CreateNewNote());

	const [triggerReload, setTriggerReload] = React.useState<number>(0);

  React.useEffect(() => {
				setLoadingState('Loading');
        const handle = props.GetNotes( ascending, sortField, props.ReferenceTableID);
        handle.done((d: string) => { setData(JSON.parse(d) as OpenXDA.Types.Note[]); setLoadingState('Idle') });
        handle.fail(() => setLoadingState('Error'))

        return () => { if (handle != null && handle.abort != null) handle.abort(); }
    }, [props.ReferenceTableID, ascending, sortField, triggerReload]);

	React.useEffect(() => {
		if (note.NoteTypeID > 0 || props.NoteTypes.length === 0)
			return;
		setNote((n) => ({...n, NoteTypeID: props.NoteTypes[0].ID}));
	},[props.NoteTypes]);

	React.useEffect(() => {
		if (note.NoteApplicationID > 0 || props.NoteApplications.length === 0)
			return;
			setNote((n) => ({...n, NoteApplicationID: props.NoteApplications[0].ID}));

	},[props.NoteApplications]);

	React.useEffect(() => {
		if (note.NoteTagID > 0 || props.NoteTags.length === 0)
			return;
		setNote((n) => ({...n, NoteTagID: props.NoteTags[0].ID}));

	},[props.NoteTags]);

	React.useEffect(() => {

		if (note.ReferenceTableID === undefined)
			return

		setNote((n) => ({...n, ReferenceTableID: props.ReferenceTableID !== undefined ? props.ReferenceTableID : -1}));
	},[props.ReferenceTableID]);


  function CreateNewNote() {
		const newNote: OpenXDA.Types.Note = {ID: -1, ReferenceTableID: -1, NoteTagID: -1, NoteTypeID: -1, NoteApplicationID: -1, Timestamp: '', UserAccount: '', Note: '' }

		if (props.ReferenceTableID !== undefined)
			newNote.ReferenceTableID = props.ReferenceTableID;

	  if (props.NoteApplications.length > 0)
			newNote.NoteApplicationID = props.NoteApplications[0].ID;

		if (props.NoteTypes.length > 0)
			newNote.NoteTypeID = props.NoteTypes[0].ID;

		if (props.NoteTags.length > 0)
			newNote.NoteTagID = props.NoteTags[0].ID;

			return newNote;
	}

  function handleEdit(d: OpenXDA.Types.Note) {
			setNote(d);
      setEdit(true);
		}

	function handleRemove(d: OpenXDA.Types.Note) {
			if (props.DeleteNote === undefined)
				return;

			setLoadingState('Loading');
			const handle = props.DeleteNote(d);
			handle.done(() => {
				setTriggerReload((x) => x + 1)
			})
			handle.fail(() => setLoadingState('Error'));
	}

	function handleAdd(d: OpenXDA.Types.Note) {
		if (props.AddNote === undefined)
			return;

		setLoadingState('Loading');
		setNote(CreateNewNote());
		const handle = props.AddNote(d);
		handle.done(() => {
			setTriggerReload((x) => x + 1)
		})
		handle.fail(() => setLoadingState('Error'))
	}

	function handleSaveEdit(confirm: boolean) {
        if (note.Note.length === 0 && confirm)
            return;

        setEdit(false);
        if (confirm && props.UpdateNote !== undefined) {
					setLoadingState('Loading')
					const handle = props.UpdateNote(note);
					handle.done(() => {
						setTriggerReload((x) => x + 1)
					})
					handle.fail(() => setLoadingState('Error'))
        }

      	setNote(CreateNewNote());

    }


	if (loadingState === 'Loading')
		return (<div style={{ width: '100%', height: '100%', opacity: 0.5, backgroundColor: '#000000', }}>
						 <div style={{height: '40px', width: '40px', margin:'auto', marginTop: 'calc(50% - 20 px)'}}>
							 <LoadingIcon Show={true} Size={40}/>
						 </div>
					 </div>)

		if (loadingState === "Error")
			return (<div style={{ width: '100%', height: '100%'}}>
							 <div style={{height: '40px', margin:'auto', marginTop: 'calc(50% - 20 px)'}}>
								 <ServerErrorIcon Show={true} Size={40} Label={'A Server Error Occured. Please Reload the Application'}/>
							 </div>
						 </div>)

    return (
				<div className="card" style={{ marginBottom: 10, maxHeight: props.MaxHeight, width: '100%'}}>
					<div className="card-header">
                <div className="row">
                    <div className="col">
                        <h4>{props.Title !== undefined? props.Title : 'Notes:'}</h4>
                    </div>
                </div>
            </div>
						<div className="card-body" style={{ maxHeight: props.MaxHeight - 100, overflowY: 'auto', width: '100%' }}>
            <div>
							<Table<OpenXDA.Types.Note>
										cols={[
												{ key: 'Note', label: 'Note', headerStyle: { width: '50%' }, rowStyle: { width: '50%' } },
												{ key: 'Timestamp', label: 'Time', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' }, content: (item) => moment.utc(item.Timestamp).format("MM/DD/YYYY HH:mm") },
												{ key: 'UserAccount', label: 'User', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' } },
												{
														key: 'buttons', label: '', headerStyle: { width: 'auto' }, rowStyle: { width: 'auto' }, content: (item) => <>
																{props.UpdateNote !== undefined? <button className="btn btn-sm" onClick={() => handleEdit(item)}><span> {Pencil} </span></button> : null }
																{props.DeleteNote !== undefined? <button className="btn btn-sm" onClick={() => handleRemove(item)}><span> {TrashCan} </span></button> : null }
														</>
												},

										]}

										tableClass="table table-hover"
										data={data}
										sortKey={sortField}
										ascending={ascending}
										onSort={(d) => {
												if (d.colField === sortField)
														setAscending(!ascending);
												else {
														setAscending(true);
														if (d.colField !== null)
															setSortField(d.colField as string);
												}

										}}
										onClick={() => { return;}}
										theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
										tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight - 300, width: '100%' }}
										rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
										selected={() => false}
								/>
            </div>
						{props.AddNote !== undefined?
							<NoteOptions Record={note} Setter={(n) => setNote(n)} NoteTags={props.NoteTags} NoteTypes={props.NoteTypes} NoteApplications={props.NoteApplications}/>
						 : null }
						 <Modal Show={showEdit} Title={'Edit Note'}
                    ShowCancel={true}
                    CallBack={handleSaveEdit}
                    DisableConfirm={note.Note === null || note.Note.length === 0}
                    ShowX={true}
                    ConfirmShowToolTip={note.Note === null || note.Note.length === 0}
                    ConfirmToolTipContent={
                        <p> <i style={{ marginRight: '10px', color: '#dc3545' }} className="fa fa-exclamation-circle"></i>
                        An empty Note can not be saved. </p>
                    }>
                    <NoteOptions Record={note} Setter={(n) => setNote(n)} NoteTags={props.NoteTags} NoteTypes={props.NoteTypes} NoteApplications={props.NoteApplications}/>
                </Modal>
						</div>
						  {props.AddNote !== undefined?
								<div className="card-footer">
								<div className="btn-group mr-2">
                    <button className={"btn btn-primary" + (note.Note === null ||note.Note.length === 0 ? ' disabled' : '')} onClick={() => { if (note.Note !== null && note.Note.length > 0) handleAdd(note); }} data-tooltip={"Add"} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} onMouseOver={() => setHoverAdd(true)} onMouseOut={() => setHoverAdd(false)}>Add Note</button>
                    <ToolTip Show={hoverAdd && ( note.Note === null || note.Note.length === 0 )} Position={'top'} Theme={'dark'} Target={"Add"}>
                        <p> A note needs to be entered. </p>
                    </ToolTip>
                </div>
                <div className="btn-group mr-2">
                    <button className={"btn btn-default" + (note.Note === null || note.Note.length === 0  ? ' disabled' : '')} onClick={() => setNote((n) => ({...n, Note: ''}))} style={{ cursor: note.Note === null || note.Note.length === 0 ? 'not-allowed' : 'pointer' }} data-tooltip={"Remove"} onMouseOver={() => setHoverClear(true)} onMouseOut={() => setHoverClear(false)} >Clear</button>
                    <ToolTip Show={hoverClear && (note.Note === null || note.Note.length === 0)} Position={'top'} Theme={'dark'} Target={"Remove"}>
                        <p> The note field is already empty. </p>
                    </ToolTip>
                </div>
            </div>
						: <div className="card-footer"> </div>}
            </div>
        )
}

interface OptionProps {
	Record: OpenXDA.Types.Note,
	Setter: (d: OpenXDA.Types.Note) => void,
	NoteTypes: OpenXDA.Types.NoteType[],
	NoteTags: OpenXDA.Types.NoteTag[],
	NoteApplications: OpenXDA.Types.NoteApplication[]
}

function NoteOptions(props: OptionProps) {

	const showOptions = props.NoteTags.length > 1 || props.NoteTypes.length > 1 || props.NoteApplications.length > 1;
	return (
	<div className="row">
		<div className={showOptions? "col-6" : 'col-12'}>
			<TextArea<OpenXDA.Types.Note> Record={props.Record} Rows={4} Field={'Note'} Setter={(n) => props.Setter(n)} Valid={() => props.Record.Note.length > 0} Label={''} />
		</div>
	{showOptions? <div className="col-6">
		{props.NoteTypes.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteTypeID'} Label={'Note for: '} Options={props.NoteTypes.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteTypeID: parseInt(record.NoteTypeID.toString(),10)})}/> : null}
		{props.NoteTags.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteTagID'} Label={'Type: '} Options={props.NoteTags.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteTagID: parseInt(record.NoteTagID.toString(),10)})}/>: null}
		{props.NoteApplications.length > 1? <Select<OpenXDA.Types.Note> Record={props.Record} Field={'NoteApplicationID'} Label={'Application: '} Options={props.NoteApplications.map(r => ({Value: r.ID.toString(), Label: r.Name }))} Setter={(record: OpenXDA.Types.Note) => props.Setter({...record, NoteApplicationID: parseInt(record.NoteApplicationID.toString(),10)})}/>: null}
	</div> : null }
	</div>);

}

export default Note;
