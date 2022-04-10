import { Vehicle as DatabaseVehicle } from '../Database/entity/Vehicle'
export { Vehicle as DatabaseVehicle } from '../Database/entity/Vehicle'

export interface Vehicle extends VehicleMp {
  database?: DatabaseVehicle
}
