import { Base64 } from 'js-base64';
/**
 *
 * @param str json encoded in Base64
 */
export const decodeJsonLikeBase64 = (str) => {
    try {
        return JSON.parse(Base64.decode(str));
    }
    catch (error) {
        console.error('Invalid Jsonlike Base64 string', error);
        return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0LWRlY29kZXIuZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL2Z1bmN0aW9uL2Jhc2U2NC1kZWNvZGVyLmZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFLbkM7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsQ0FBOEIsR0FBaUIsRUFBWSxFQUFFO0lBQ2hHLElBQUk7UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDO0tBQ1o7QUFDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjQgfSBmcm9tICdqcy1iYXNlNjQnO1xuXG5leHBvcnQgdHlwZSBCYXNlNjRTdHJpbmcgPSBzdHJpbmc7XG5leHBvcnQgdHlwZSBKc29uU3RyaW5nID0gc3RyaW5nO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gc3RyIGpzb24gZW5jb2RlZCBpbiBCYXNlNjRcbiAqL1xuZXhwb3J0IGNvbnN0IGRlY29kZUpzb25MaWtlQmFzZTY0ID0gPFQgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oc3RyOiBCYXNlNjRTdHJpbmcpOiBUIHwgbnVsbCA9PiB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoQmFzZTY0LmRlY29kZShzdHIpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIEpzb25saWtlIEJhc2U2NCBzdHJpbmcnLCBlcnJvcik7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG4iXX0=