<<<<<<< HEAD
// ******************************************************************************************************
//  LoadingScreen.tsx - Gbtc
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
//  01/11/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import LoadingIcon from './LoadingIcon'
interface IProps {
  Show: boolean
}

const LoadingScreen: React.FunctionComponent<IProps> = (props) => {
  return (props.Show ? < div style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                opacity: 0.5,
                backgroundColor: '#ffffff',
                zIndex: 9980,
                }}>
                  <LoadingIcon Show={true}/>
                </div> : null)
}

export default LoadingScreen;
=======
// ******************************************************************************************************
//  LoadingScreen.tsx - Gbtc
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
//  01/11/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import LoadingIcon from './LoadingIcon'
interface IProps {
  Show: boolean
}

const LoadingScreen: React.FunctionComponent<IProps> = (props) => {

  const x = window.innerHeight /2 - 20;
  return (props.Show ? < div style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                opacity: 0.5,
                backgroundColor: '#000000',
                zIndex: 9980,
                }}>
                <div style={{height: '40px', width: '40px', margin:'auto', marginTop: x}}>
                  <LoadingIcon Show={true} Size={40}/>
                </div>
                </div> : null)
}

export default LoadingScreen;
>>>>>>> 4ddf5b42859d0d6771f955f9344228b0b40b57ff
