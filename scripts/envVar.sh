#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}../consortium/organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/msp/tlscacerts/tlsca.hospital-network.com-cert.pem
export PEER0_DOCTOR_CA=${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/ca.crt
export PEER0_LAB_CA=${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/ca.crt
#export PEER0_ORG3_CA=${PWD}../consortium/organizations/peerOrganizations/org3.hospital-network.com/peers/peer0.org3.hospital-network.com/tls/ca.crt
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}../consortium/organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}../consortium/organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/server.key

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq "DoctorDepartment" ]; then
    export CORE_PEER_LOCALMSPID="DoctorDepartmentMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_DOCTOR_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/users/Admin@doctor.hospital-network.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG -eq "LaboratoryDepartment" ]; then
    export CORE_PEER_LOCALMSPID="LobaratoryDepartmentMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_LAB_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/users/Admin@lab.hospital-network.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

 # elif [ $USING_ORG -eq 3 ]; then
 #   export CORE_PEER_LOCALMSPID="Org3MSP"
 #   export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
 #   export CORE_PEER_MSPCONFIGPATH=${PWD}../consortium/organizations/peerOrganizations/org3.hospital-network.com/users/Admin@org3.hospital-network.com/msp
 #   export CORE_PEER_ADDRESS=localhost:11051
  else
   errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  setGlobals $1

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ $USING_ORG -eq "DoctorDepartment" ]; then
    export CORE_PEER_ADDRESS=peer0.doctor.hospital-network.com:7051
  elif [ $USING_ORG -eq "LaboratoryDepartment" ]; then
    export CORE_PEER_ADDRESS=peer0.lab.hospital-network.com:9051
 # elif [ $USING_ORG -eq 3 ]; then
 # export CORE_PEER_ADDRESS=peer0.org3.hospital-network.com:11051
  else
   errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=()
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    if [ "$1" -eq "DoctorDepartment"]
    then 
      PEER="peer0.doctor"
    else
      PEER="peer0.lab"
    fi
    ## Set peer addresses
    if [ -z "$PEERS" ]
    then
	PEERS="$PEER"
    else
	PEERS="$PEERS $PEER"
    fi
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" --peerAddresses $CORE_PEER_ADDRESS)
    ## Set path to TLS certificate
    if [ "$1" -eq "DoctorDepartment"]
    then
      CA=PEER0_DOCTOR_CA
    else
      CA=PEER0_LAB_CA
    fi
    TLSINFO=(--tlsRootCertFiles "${!CA}")
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" "${TLSINFO[@]}")
    # shift by one to get to the next organization
    shift
  done
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}