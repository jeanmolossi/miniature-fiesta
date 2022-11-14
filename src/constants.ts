const shouldOpenToNetwork = true;
const networkHOST = shouldOpenToNetwork
	? '192.168.100.11'
	: 'localhost';

const constants = {
	API_BASE_URL: `http://${networkHOST}:3001`,
	HOST_URL: `http://${networkHOST}:3000`
}

export default constants;
