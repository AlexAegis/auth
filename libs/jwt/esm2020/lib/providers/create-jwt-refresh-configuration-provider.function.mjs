import { JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export const createJwtRefreshConfigurationProvider = (tokenRefreshConfigurationProvider) => ({
    provide: JWT_REFRESH_CONFIGURATION_TOKEN,
    multi: false,
    ...tokenRefreshConfigurationProvider,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWp3dC1yZWZyZXNoLWNvbmZpZ3VyYXRpb24tcHJvdmlkZXIuZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL3Byb3ZpZGVycy9jcmVhdGUtand0LXJlZnJlc2gtY29uZmlndXJhdGlvbi1wcm92aWRlci5mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR04sK0JBQStCLEdBQy9CLE1BQU0sa0NBQWtDLENBQUM7QUFFMUM7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHFDQUFxQyxHQUFHLENBQ3BELGlDQUdDLEVBQ2tFLEVBQUUsQ0FDckUsQ0FBQztJQUNBLE9BQU8sRUFBRSwrQkFBK0I7SUFDeEMsS0FBSyxFQUFFLEtBQUs7SUFDWixHQUFHLGlDQUFpQztDQUNpQyxDQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRKd3RNb2R1bGVSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRKd3RSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRKV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxufSBmcm9tICcuLi90b2tlbi9qd3QtY29uZmlndXJhdGlvbi50b2tlbic7XG5cbi8qKlxuICogSGVscHMgeW91IGRlZmluZSBhIEp3dENvbmZpZ3VyYXRpb25Qcm92aWRlclxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlSnd0UmVmcmVzaENvbmZpZ3VyYXRpb25Qcm92aWRlciA9IDxSZWZyZXNoUmVxdWVzdCwgUmVmcmVzaFJlc3BvbnNlPihcblx0dG9rZW5SZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyOiBKd3RNb2R1bGVSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyPFxuXHRcdFJlZnJlc2hSZXF1ZXN0LFxuXHRcdFJlZnJlc2hSZXNwb25zZVxuXHQ+XG4pOiBKd3RSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyPFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+ID0+XG5cdCh7XG5cdFx0cHJvdmlkZTogSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcblx0XHRtdWx0aTogZmFsc2UsXG5cdFx0Li4udG9rZW5SZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHR9IGFzIEp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI8UmVmcmVzaFJlcXVlc3QsIFJlZnJlc2hSZXNwb25zZT4pO1xuIl19