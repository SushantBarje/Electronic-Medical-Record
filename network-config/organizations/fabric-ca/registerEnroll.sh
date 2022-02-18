#!/bin/bash

function createDoctorOrg() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/doctor.hospital_network.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/

  set -x
  fabric-ca-client enroll -u https://doctoradmin:doctorpw@localhost:7054 --caname ca-doctor --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
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
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-doctor --id.name doctordoctoradmin --id.secret doctordoctorpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-doctor -M "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/msp" --csr.hosts peer0.doctor.hospital_network.com --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-doctor -M "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls" --enrollment.profile tls --csr.hosts peer0.doctor.hospital_network.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/tlsca/tlsca.doctor.hospital_network.com-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/ca"
  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/peers/peer0.doctor.hospital_network.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/ca/ca.doctor.hospital_network.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-doctor -M "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/users/User1@doctor.hospital_network.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/users/User1@doctor.hospital_network.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://doctordoctoradmin:doctordoctorpw@localhost:7054 --caname ca-doctor -M "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/users/Admin@doctor.hospital_network.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/doctor/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/doctor.hospital_network.com/users/Admin@doctor.hospital_network.com/msp/config.yaml"
}

function createLaboratoryOrg() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/laboratory.hospital_network.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/

  set -x
  fabric-ca-client enroll -u https://laboratoryadmin:laboratorypw@localhost:8054 --caname ca-laboratory --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-laboratory --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-laboratory --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-laboratory --id.name laboratorylaboratory --id.secret laboratorylaboratorypw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-laboratory -M "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/msp" --csr.hosts peer0.laboratory.hospital_network.com --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-laboratory -M "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls" --enrollment.profile tls --csr.hosts peer0.laboratory.hospital_network.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/tlsca/tlsca.laboratory.hospital_network.com-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/ca"
  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/peers/peer0.laboratory.hospital_network.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/ca/ca.laboratory.hospital_network.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-laboratory -M "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/users/User1@laboratory.hospital_network.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/users/User1@laboratory.hospital_network.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://laboratorylaboratory:laboratorylaboratorypw@localhost:8054 --caname ca-laboratory -M "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/users/Admin@laboratory.hospital_network.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/laboratory/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/laboratory.hospital_network.com/users/Admin@laboratory.hospital_network.com/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/hospital_network.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/hospital_network.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
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
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/hospital_network.com/msp/config.yaml"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/msp" --csr.hosts orderer.hospital_network.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls" --enrollment.profile tls --csr.hosts orderer.hospital_network.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/msp/tlscacerts/tlsca.hospital_network.com-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/hospital_network.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/orderers/orderer.hospital_network.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/hospital_network.com/msp/tlscacerts/tlsca.hospital_network.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/hospital_network.com/users/Admin@hospital_network.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/hospital_network.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/hospital_network.com/users/Admin@hospital_network.com/msp/config.yaml"
}
