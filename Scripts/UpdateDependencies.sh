#******************************************************************************************************
#  UpdateDependencies.sh - Gbtc
#
#  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
#
#  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
#  the NOTICE file distributed with this work for additional information regarding copyright ownership.
#  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
#  file except in compliance with the License. You may obtain a copy of the License at:
#
#      http://opensource.org/licenses/MIT
#
#  Unless agreed to in writing, the subject software distributed under the License is distributed on an
#  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
#  License for the specific language governing permissions and limitations.
#
#  Code Modification History:
#  ----------------------------------------------------------------------------------------------------
#  07/26/2021 - C. Lackner
#       Generated original version of source code.
#
#******************************************************************************************************
declare -a all_packages=('application-typings' 'gpa-symbols' 'helper-functions' 'react-forms' 'react-graph' 'react-interactive' 'react-table' 'common-pages')
declare -A DependencyHash=()
declare -a updateRequired=()
declare -A currentVersion=()

function LoadPackage()
{
  echo "Loading Dependencies for $1"
  declare inDep=0
  declare inDev=0
  declare hasVersion=0
  while IFS= read -r line;
  do
    r='\"version": '
    if [[ $line =~ $r ]] && [[ "$hasVersion" -eq "0" ]]
    then
      item=(${line//:/ })
      vers=${item[1]}
      vers="${vers%,}"
      vers="${vers%\"}"
      vers="${vers#\"}"
      currentVersion[$1]="$vers"
      hasVersion=1
    fi

    r='\"dependencies\": \{'
    if [[ $line =~ $r ]];
    then
      inDep=1
      r='\}'
      if [[ $line =~ $r ]];
      then
          inDep=0
      fi
      continue
    fi
    r='\"devDependencies\": \{'
    if [[ $line =~ $r ]];
    then
      inDev=1
      r='\}'
      if [[ $line =~ $r ]];
      then
          inDev=0
      fi
      continue
    fi

    r='\}'
    if [[ $line =~ $r ]] && [[ "$inDev" -eq "1" ]]
    then
      inDev=0
    fi
    if [[ $line =~ $r ]] && [[ "$inDep" -eq "1" ]]
    then
      inDep=0
    fi

    if [[ "$inDep" -eq "1" ]] || [[ "$inDev" -eq "1" ]];
    then
      item=(${line//:/ })
      key=${item[0]}
      key="${key%\"}"
      key="${key#\"}"
      vers=${item[1]}
      vers=`echo $vers | sed "s/ *$//g"`
      vers="${vers%,}"
      vers="${vers%\"}"
      vers="${vers#\"}"
      if [[ "${DependencyHash[$key]+foobar}" ]]
      then
        if ! [[ "${DependencyHash[$key]}" == "$vers" ]]
        then
          updateRequired+=( $key )
          nVers=$(GetNewerVersion "${DependencyHash[$key]}" "$vers")

          DependencyHash[$key]="$nVers"
        fi
      else
        DependencyHash[$key]="$vers"
      fi
    fi
  done < "$GITHUB_WORKSPACE/$1/package.json"
}

#Update Package.json as neccesarry
function UpdatePackage()
{
  echo "Updating Dependencies for $1"
  declare inDep=0
  declare inDev=0
  declare incrVersion=0
  declare hasVersion=0
  declare versionLine=""
  while IFS= read -r line;
  do
    r='\"version": '
    if [[ $line =~ $r ]] && [[ "$hasVersion" -eq "0" ]];
    then
      versionLine=$line
      hasVersion=1
    fi

    r='\"dependencies\": \{'
    if [[ $line =~ $r ]];
    then
      inDep=1
      r='\}'
      if [[ $line =~ $r ]];
      then
          inDep=0
      fi
      continue
    fi
    r='\"devDependencies\": \{'
    if [[ $line =~ $r ]];
    then
      inDev=1
      r='\}'
      if [[ $line =~ $r ]];
      then
          inDev=0
      fi
      continue
    fi


    r='\}'
    if [[ $line =~ $r ]]
    then
      inDev=0
      inDep=0
    fi

    if [[ "$inDep" -eq "1" ]] || [[ "$inDev" -eq "1" ]];
    then
      item=(${line//:/ })
      key=${item[0]}
      key="${key%\"}"
      key="${key#\"}"
      vers=${item[1]}
      vers="${vers%,}"
      vers="${vers%\"}"
      vers="${vers#\"}"
      #If Key is in To be updated we will need to update the version
      if $(ContainsElement "$key" "${updateRequired[@]}") && ! [[ "${DependencyHash[$key]}" == "$vers" ]]
      then
        newLine="${line/$vers/${DependencyHash[$key]}}"
        sed -i "s|$line|$newLine|gi" "$GITHUB_WORKSPACE/$1/package.json"
        incrVersion=1
       fi
      #if it's a GPA-gemstone package we check against the current version instead
      r='@gpa-gemstone/'
      if [[ $key =~ $r ]]
      then
        item=(${key//// })
        sKey=${item[1]}
        if ! [[ "${currentVersion[$sKey]}" == "$vers" ]]
        then
          newLine="${line/$vers/${currentVersion[$sKey]}}"
          sed -i "s|$line|$newLine|gi" "$GITHUB_WORKSPACE/$1/package.json"
          incrVersion=1
          echo "Updating gemstone Package"
        fi
      fi
    fi
  done < "$GITHUB_WORKSPACE/$1/package.json"

  #If we need to republish increase version number and set required version for
  # next package in the chain
  if [[ "$incrVersion" -eq "1" ]]
  then

    oldVersion=${currentVersion[$1]}
    newversion=$(IncrementVersion $oldVersion)
    echo "Move $1 to $newversion"
    currentVersion[$1]=$newversion
    newLine="${versionLine/$oldVersion/$newversion}"
    echo $newLine
    sed -i "s|$versionLine|$newLine|gi" "$GITHUB_WORKSPACE/$1/package.json"
  fi
}

function GetNewerVersion()
{
  v1="${1%^}"
  v2="${2%^}"

  n1=(${v1//./ })
  n2=(${v2//./ })

  #Fill up empty fields
  if ((${#n1[@]} < ${#n2[@]}))
  then
    for ((i=${#n1[@]}; i<${#n2[@]}; i++))
    do
      n1[i]=0
    done
  fi

  for ((i=0; i<${#n1[@]}; i++))
  do
    if [[ -z ${n2[i]} ]]
    then
      n2[i] = 0
    fi
    if ((10#${n1[i]} > 10#${n2[i]}))
    then
      echo "$1"
      return
    fi
    if ((10#${n1[i]} < 10#${n2[i]}))
    then
      echo "$2"
      return
    fi
  done
  echo "$1"
}

function ContainsElement()
{
    local e match="$1"
    shift
    for e; do [[ "$e" == "$match" ]] && return 0; done
    return 1
}

function IncrementVersion()
{
    v="${1%^}"
    n=(${v//./ })
    n[2]=$((n[2]+1))
    echo "${n[0]}.${n[1]}.${n[2]}"
}

for p in "${all_packages[@]}"
do
  LoadPackage "$p"
done

for p in "${all_packages[@]}"
do
  UpdatePackage "$p"
done
