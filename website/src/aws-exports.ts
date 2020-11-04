const awsmobile = {
    "aws_appsync_graphqlEndpoint": process.env.REACT_APP_APPSYNC_ENDPOINT as string,
    "aws_appsync_region": process.env.REACT_APP_APPSYNC_REGION as string,
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": process.env.REACT_APP_APPSYNC_APIKEY as string,
};

export default awsmobile;