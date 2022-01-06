#!/bin/bash

function createDoctorDeptCertificate() {
  infoln "Enrolling the CA admin"
  mkdir -p ../consortium/organizations/peerOrganizations/doctor.hospital-network.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-doctor --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-doctor.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-doctor.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-doctor.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-doctor.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the Doctor Department admin"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name doctoradmin --id.secret doctoradminpw --id.type admin --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-doctor -M "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/msp" --csr.hosts peer0.doctor.hospital-network.com --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-doctor -M "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls" --enrollment.profile tls --csr.hosts peer0.doctor.hospital-network.com --csr.hosts localhost --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/ca.crt"
  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/signcerts/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/server.crt"
  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/keystore/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/server.key"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/tlscacerts"
  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/tlsca"
  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/tlsca/tlsca.doctor.hospital-network.com-cert.pem"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/ca"
  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/peers/peer0.doctor.hospital-network.com/msp/cacerts/"* "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/ca/ca.doctor.hospital-network.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-doctor -M "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/users/User1@doctor.hospital-network.com/msp" --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/users/User1@doctor.hospital-network.com/msp/config.yaml"

  infoln "Generating the Doctor Department admin msp"
  set -x
  fabric-ca-client enroll -u https://doctoradmin:doctoradminpw@localhost:7054 --caname ca-doctor -M "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/users/Admin@doctor.hospital-network.com/msp" --tls.certfiles "${PWD}../consortium/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/doctor.hospital-network.com/users/Admin@doctor.hospital-network.com/msp/config.yaml"
}

function createLaboratoryDeptCertificate() {
  infoln "Enrolling the CA admin"
  mkdir -p ../consortium/organizations/peerOrganizations/lab.hospital-network.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-lab --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-lab.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-lab.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-lab.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-lab.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-lab --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-lab --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the Laboratory admin"
  set -x
  fabric-ca-client register --caname ca-lab --id.name labadmin --id.secret labadminpw --id.type admin --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-lab -M "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/msp" --csr.hosts peer0.lab.hospital-network.com --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-lab -M "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls" --enrollment.profile tls --csr.hosts peer0.lab.hospital-network.com --csr.hosts localhost --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/ca.crt"
  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/signcerts/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/server.crt"
  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/keystore/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/server.key"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/tlscacerts"
  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/tlsca"
  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/tlsca/tlsca.lab.hospital-network.com-cert.pem"

  mkdir -p "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/ca"
  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/peers/peer0.lab.hospital-network.com/msp/cacerts/"* "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/ca/ca.lab.hospital-network.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-lab -M "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/users/User1@lab.hospital-network.com/msp" --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/users/User1@lab.hospital-network.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://labadmin:labadminpw@localhost:8054 --caname ca-lab -M "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/users/Admin@lab.hospital-network.com/msp" --tls.certfiles "${PWD}../consortium/fabric-ca/lab/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/msp/config.yaml" "${PWD}../consortium/organizations/peerOrganizations/lab.hospital-network.com/users/Admin@lab.hospital-network.com/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/hospital-network.com

  export FABRIC_CA_CLIENT_HOME=${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/msp/config.yaml"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/msp" --csr.hosts orderer.hospital-network.com --csr.hosts localhost --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/msp/config.yaml" "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls" --enrollment.profile tls --csr.hosts orderer.hospital-network.com --csr.hosts localhost --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/ca.crt"
  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/signcerts/"* "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/server.crt"
  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/keystore/"* "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/server.key"

  mkdir -p "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/msp/tlscacerts"
  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/msp/tlscacerts/tlsca.hospital-network.com-cert.pem"

  mkdir -p "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/msp/tlscacerts"
  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/orderers/orderer.hospital-network.com/tls/tlscacerts/"* "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/msp/tlscacerts/tlsca.hospital-network.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/users/Admin@hospital-network.com/msp" --tls.certfiles "${PWD}../consortium/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/msp/config.yaml" "${PWD}../consortium//organizations/ordererOrganizations/hospital-network.com/users/Admin@hospital-network.com/msp/config.yaml"
}