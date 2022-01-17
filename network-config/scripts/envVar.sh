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
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/msp/tlscacerts/tlsca.hospital_network.com-cert.pem
export PEER0_DOCTOR_CA=${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/ca.crt
export PEER0_LABORATORY_CA=${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/ca.crt
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.hospital_network.com/peers/peer0.org3.hospital_network.com/tls/ca.crt
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/server.key

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="DoctorMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_DOCTOR_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/users/Admin@doctor.hospital_network.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="LaboratoryMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_LABORATORY_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/users/Admin@laboratory.hospital_network.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.hospital_network.com/users/Admin@org3.hospital_network.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
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
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_ADDRESS=peer0.doctor.hospital_network.com:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_ADDRESS=peer0.laboratory.hospital_network.com:9051
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_ADDRESS=peer0.org3.hospital_network.com:11051
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
    if [ $1 -eq 1 ]; then
      PEER="peer0.doctor"
    elif [ $1 -eq 2 ]; then
      PEER="peer0.laboratory"
    else
      PEER="peer0.org$1"
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
    if [ $1 -eq 1 ]; then
      CA=PEER0_DOCTOR_CA
    elif [ $1 -eq 2 ]; then
      CA=PEER0_LABORATORY_CA
    else
      CA=PEER0_ORG$1_CA
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
