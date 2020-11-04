import "jest";

jest.setTimeout(30000);
jest.mock("aws-xray-sdk", () => {
  return {
    captureAWS(_module: any): any {
      return require("aws-sdk");
    },
    captureHTTPsGlobal(_module: any): any {
      return require("aws-sdk");
    },
    getSegment(): any {
      return {
        addNewSubsegment(_name: string): any {
          return {
            close(): void { },
            addError(_error: Error): void { },
            addAnnotation(_id: any, _value: any): void { },
            addMetadata(_key: string, _value: any, _namespace?: string): void { },
            addAttribute(_name: string, _data: any): void { },
            isClosed(): boolean {
              return false;
            }
          };
        },
        close(): void { },
        isClosed(): boolean {
          return false;
        }
      };
    }
  };
});
