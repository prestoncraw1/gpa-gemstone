#******************************************************************************************************
#  UpdateDependencies.ps1 - Gbtc
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
#  07/30/2021 - C. Lackner
#       Generated original version of source code.
#
#******************************************************************************************************
param(
   [string]$projectDir,
   [int]$publish
)

#$projectDir = "D:\\Projects\gpa-gemstone\"
#$publish=1

if ([string]::IsNullOrWhiteSpace($projectDir)) {
    throw "projectDir parameter was not provided, script terminated."
}

$AllPackages = "application-typings", "gpa-symbols", "helper-functions", "react-forms", "react-graph", "react-interactive", "react-table", "common-pages"

$global:DependencyHash = @{}
$updateRequired = @()
$global:currentVersion = @{}
$global:updated = @()

function LoadPackage($package)
{
  echo "Loading Dependencies for $package"
  $inDep = 0
  $inDev = 0
  $hasVersion = 0

  foreach($line in Get-Content "$projectDir\$package\package.json") {
    $r="`"version`": "
    if ( $line -match $r -and $hasVersion -eq 0)
    {
    
      $item =$line.Split(":")
      $vers= $item[1]
      $vers= $vers.Trim()
      $vers=$vers.Trim(",")
      $vers=$vers.Trim("`"")
      $global:currentVersion[$package] = $vers
      $hasVersion=1
    }

    $r="`"dependencies`": {"
    if ( $line -match $r)
    {
      $inDep=1
      $r="}"
      if ( $line -match $r)
      {
          $inDep = 0
      }
	  else {
		  continue
	  }
    }
    $r="`"devDependencies`": \{"
    if ( $line -match $r)
    {
      $inDev=1
      $r="\}"
      if ( $line -match $r)
      {
          $inDev = 0
      }
      continue
    }

    $r="}"
    if ( $line -match $r -and $inDev -eq 1)
    {
      $inDev = 0
    }
    if ( $line -match $r -and $inDep -eq 1)
    {
      $inDep = 0
    }

    if ( $inDep -eq 1 -or $inDev -eq 1)
    {
      $item = $line.Split(":")
      $key = $item[0]
      $key = $key.Trim()
      $vers = $item[1]
      $vers = $vers.Trim()
      $vers = $vers.Trim(",")
      $vers = $vers.Trim("`"")

      if ($global:DependencyHash.ContainsKey($key))
      {
        if ($global:DependencyHash[$key] -ne $vers)
        {
		
          $updateRequired+=@("$key")
          $nVers=GetNewerVersion $global:DependencyHash[$key] $vers
		  echo "Version $nVers found for $key"
          $global:DependencyHash[$key] = $nVers
        }
	  }
	  else
	  {
	    $global:DependencyHash[$key] = $vers
	  }
     
	  
    }
  }
  
  echo "Current Version: $($global:currentVersion[$package])"
  echo "$($updateRequired.count) packages need to be updated"
}

#Update Package.json as neccesarry
function UpdatePackage($package)
{
  echo "Updating Dependencies for $package"
  $inDep = 0
  $inDev = 0
  $incrVersion = 0
  $hasVersion = 0
  $versionLine=""
  foreach($line in Get-Content "$projectDir\$package\package.json") {
    $r="`"version`": "
    if ( $line -match $r -and $hasVersion -eq 0)
    {
      $versionLine = $line
      $hasVersion = 1
    }

    $r="`"dependencies`": \{"
    if ( $line -match $r)
    {
      $inDep = 1
      $r = "\}"
      if ( $line -match $r)
      {
          $inDep = 0
      }
      continue
    }
    $r = "`"devDependencies`": \{"
    if ( $line -match $r)
    {
      $inDev = 1
      $r = "\}"
      if ( $line -match $r)
      {
          $inDev = 0
      }
      continue
    }


    $r = "\}"
    if ( $line -match $r )
    {
      $inDev = 0
      $inDep = 0
    }

    if ($inDep -eq 1 -or  $inDev -eq 1 )
    {
      $item = $line.Split(":")
      $key = $item[0]
      $key = $key.Trim()
      $vers = $item[1]
      $vers = $vers.Trim()
      $vers = $vers.Trim(",")
      $vers = $vers.Trim("`"")
	  
      #If Key is in To be updated we will need to update the version
      if ( $updateRequired.Contains($key) )
      {
        $newLine = $line -replace "$vers", "$($global:DependencyHash[$key])"
        (Get-Content "$projectDir\$package\package.json").replace($line, $newLine) | Set-Content "$projectDir\$package\package.json"
        $incrVersion = 1
		echo "updating $key"
      }
      #if it's a GPA-gemstone package we check against the current version instead
      $r = "@gpa-gemstone/"
      if ( $line -match $r )
      {
        $item = $key.Split("/")
        $sKey = $item[1]
        if ( $global:currentVersion[$sKey] -ne $vers )
        {
            $newLine = $line -replace "$vers", "$($global:currentVersion[$sKey])"
            (Get-Content "$projectDir\$package\package.json").replace($line, $newLine) | Set-Content "$projectDir\$package\package.json"          
            $incrVersion = 1
            echo "Updating $sKey"
        }
      }
    }
  }
  
  #If we need to republish increase version number and set required version for
  # next package in the chain
  if ( $incrVersion -eq 1 )
  {
    $oldVersion = $global:currentVersion[$package]
    $newversion = IncrementVersion($oldVersion)
    echo "Move $package to $newversion"
    $global:currentVersion[$package] = $newversion
    $newLine = $versionLine -replace "$oldVersion", "$newversion"
    (Get-Content "$projectDir\$package\package.json").replace($versionLine, $newLine) | Set-Content "$projectDir\$package\package.json"  
    echo $global:updated
	$global:updated.GetType()
	$global:updated+=@("$package")
	$global:updated.GetType()
	echo $global:updated
  }

  
}

function GetNewerVersion($version1, $version2)
{

  $v1=$version1.Trim("^")
  $v2=$version2.Trim("^")


  $n1=$v1.Split(".")
  $n2=$v2.Split(".")

  #Fill up empty fields
  if ($n1.length -le $n2.length)
  {
	
    for ($i=$n1.length; $i -le $n2.length; $i++)
    {
      $n1 += 0
    }
  }

  for ($i=0; $i -le $n1.length; $i++)
  {
    if ($n2.length -le $i )
    {
      n2 += 0
    }
    if ([int]$n1[$i] -gt $n2[$i])
    {
      return $version1
      
    }
    if ([int]$n1[$i] -lt $n2[$i])
    {
      return $version2
    } 
  }
  return $version1
}


function IncrementVersion($v)
{
    $v = $v.Trim("^")
    $n = $v.split(".")
    $n[2] = [int]$n[2] + 1
    echo "$($n[0]).$($n[1]).$($n[2])"
}

foreach ($p in $AllPackages)
{
  LoadPackage "$p"
}

foreach ($p in $AllPackages)
{
  UpdatePackage "$p"
}

if ( $publish -gt 0 )
{
    foreach ($p in $global:updated)
    {
      cd "$projectDir\$p"
      npm install
      npm publish
    }
}