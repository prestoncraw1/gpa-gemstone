# react-table

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-wide-600.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)

This library includes helpful npm package component for creating interactive components in react.

## Usage
### General Modal

```ts
    <Modal Title='Title of Modal' ShowX={false} Callback={(confirmed) => setShow(false)} Show={show} Size={'lg'} ShowCancel={true} CancelText={'Cancel'} ConfirmText={'Ok'} >
		<p> Content of the Modal should go here </p>
		<p> Multiple Fields will work </p>
	</Modal >
```

### Confirmation Dialog Modal
```ts
    <Warning Title='Please Confirm' Callback={(confirmed) => setShow(false)} Show={show}  Message={'Are you sure you want to Continue?'} />
```

### Wizard ToolTip

