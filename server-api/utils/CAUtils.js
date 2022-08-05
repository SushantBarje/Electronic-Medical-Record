/**
* @author Sushant Barje
* @created 2022-02-16 T 17:18:29
* @desc 
*/

'use strict';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */

exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
}

exports.enrollAdmin = async (caClient, wallet, orgMspId, adminUserId, adminUserPassword) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPassword });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
}

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, adminUserId, obj, affiliation) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if(userIdentity){
			console.log(`An identity for user ${userId} already exists in the wallet`);
			throw new Error(`An identity for user ${userId} already exists in the wallet`);
		}
		// if (wallet2 !== '') {
		// 	const userIdentity = await wallet2.get(userId);
		// 	if (userIdentity) {
		// 		console.log(`An identity for the user ${userId} already exists in the wallet`);
		// 		return { error: 'already', message: 'User already exists' };
		// 	}
		// } else {
		// 	const userIdentity = await wallet1.get(userId);
		// 	if (userIdentity) {
		// 		console.log(`An identity for the user ${userId} already exists in the wallet`);
		// 		return { error: 'already', message: 'User already exists' };
		// 	}
		// }

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);

		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return { error: 'not admin', message: 'Admin not exists' };
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
	
		obj = JSON.parse(obj);
		const firstName = obj.firstName;
		const lastName = obj.lastName;
		const role = obj.role;
		const organization = obj.organization;
		const speciality = (role === 'doctor') ? obj.speciality : '';

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		if(role == "patient"){
			const secret = await caClient.register({
				affiliation: affiliation,
				enrollmentID: userId,
				role: 'client',
				attrs: [{
					name: 'firstName',
					value: firstName,
					ecert: true,
				}, {
					name: 'lastName',
					value: lastName,
					ecert: true,
				}, {
					name: 'role',
					value: role,
					ecert: true,
				}, {
					name: 'organization',
					value: organization,
					ecert: true,
				}],
			}, adminUser);
	
			const enrollment = await caClient.enroll({
				enrollmentID: userId,
				enrollmentSecret: secret,
				attrs: [{
					name: 'firstName',
					value: firstName,
					ecert: true,
				},
				{
					name: 'lastName',
					value: lastName,
					ecert: true,
				}, {
					name: 'role',
					value: role,
					ecert: true,
				}, {
					name: 'organization',
					value: organization,
					ecert: true,
				}],
			});
			const x509Identity = {
				credentials: {
					certificate: enrollment.certificate,
					privateKey: enrollment.key.toBytes(),
				},
				mspId: orgMspId,
				type: 'X.509',
			};

			await wallet.put(userId, x509Identity);
		}else{
			const secret = await caClient.register({
				affiliation: affiliation,
				enrollmentID: userId,
				role: 'client',
				attrs: [{
					name: 'firstName',
					value: firstName,
					ecert: true,
				}, {
					name: 'lastName',
					value: lastName,
					ecert: true,
				}, {
					name: 'role',
					value: role,
					ecert: true,
				}, {
					name: 'organization',
					value: organization,
					ecert: true,
				}, {
					name: 'speciality',
					value: speciality,
					ecert: true,
				}],
			}, adminUser);
	
			const enrollment = await caClient.enroll({
				enrollmentID: userId,
				enrollmentSecret: secret,
				attrs: [{
					name: 'firstName',
					value: firstName,
					ecert: true,
				},
				{
					name: 'lastName',
					value: lastName,
					ecert: true,
				}, {
					name: 'role',
					value: role,
					ecert: true,
				}, {
					name: 'organization',
					value: organization,
					ecert: true,
				}, {
					name: 'speciality',
					value: speciality,
					ecert: true,
				}],
			});
			const x509Identity = {
				credentials: {
					certificate: enrollment.certificate,
					privateKey: enrollment.key.toBytes(),
				},
				mspId: orgMspId,
				type: 'X.509',
			};

			await wallet.put(userId, x509Identity);
		}
		

		

		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
		return { error: 'none', message: 'Successfully registered and enrolled user' };
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
		return { error: 'already', message: 'User already exists' };
	}
}