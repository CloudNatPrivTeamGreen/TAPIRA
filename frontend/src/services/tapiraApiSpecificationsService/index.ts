import http from '../httpService';

class TapiraApiSpecificationsService {
  /**
   *
   * @returns a list of services names, for which specifications were reconstructed with apiclarity
   */
  public async getApiclaritySpecs() {
    const result = await http.get('apiclarity_specs');
    return result.data;
  }

  /**
   *
   * @returns a list of services names, for which specifications were uploaded by the user
   */
  public async getAllServices() {
    const result = await http.get('services');
    return result.data;
  }

  /**
   *
   * @returns a list of all version tags for the specifications of a service
   */
  public async getSpecVersionsForService(serviceName: string) {
    const result = await http.get('versions', {
      params: { service: serviceName },
    });
    return result.data;
  }

  /**
   * @return the specified version of the specifications for a service
   */
  public async getSpecificationsForService(
    serviceName: string,
    version: string
  ) {
    const result = await http.get('specifications', {
      params: { service: serviceName, version: version },
    });
    return result.data;
  }

    public async getSpecificationsForServiceVersion(serviceName: string, servVersion: string) {
        const result = await http.get('specifications', { params: { service: serviceName, version: servVersion }});
        return result.data;
    }

  /**
   *
   * @returns the current version of specifications for the service
   */
  public async getCurrentVersionSpecForService(serviceName: string) {
    const result = await http.get('current_version_spec', {
      params: { service: serviceName },
    });
    return result.data;
  }

  /**
   *
   * @param serviceName
   * @param data
   * @returns this uploads specifications provided by the user
   */
  public async uploadExistingAPISpecifications(
    serviceName: string,
    data: FormData
  ) {
    const result = await http.post('upload', data, {
      params: {
        service: serviceName,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return result.data;
  }
}

export default new TapiraApiSpecificationsService();
