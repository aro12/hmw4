# Solution - Aroshi Handa - Assignment 4

Error Code  | Error Message | Relevant Resources  | Parameters | Example
| ----------- | ---------- | ------------ | ----- | ------
1001  | Invalid resource name {0} given  | All Resources  | `0 - Resource Name` | Invalid resource name `fruits` given
1002  | Given {0} does not exist   | All Resources  | `0 - Resource Name` | Given `car` does not exist
2001  | Car with {0} {1} does not exist  | `Cars`  | `0 - Property Name`, `1- Value` | Car with `make` `Apple` does not exist
2002  | Invalid {0} format for the given car  | `Cars`  | `0 - Property Name` | Invalid `doorCount` format for the given car
2003 | Invalid property {0} for the given car  | `Cars` | `0 - Property Name` | Invalid property `age` for the given car 
2004  | Property {0} is required for the given car  | `Cars`  | `0 - Property Name` | Property `license` is required for the given car
2005  | Given car already exists, duplicate key error  | `Cars`  | None | 
3001  | Driver with {0} {1} does not exist   | `Drivers`  | `0 - Property Name`, `1- Value` | Driver with `licensedState` `YO` does not exist
3002  | Invalid {0} format for the given driver   | `Drivers`  | `0 - Property Name` | Invalid `emailAddress` format for the given driver
3003 | Invalid property {0} for the given driver  | `Drivers` | `0 - Property Name` | Invalid property `age` for the given driver
3004  | Property {0} is required for the given driver  | `Drivers`  | `0 - Property Name` | Property `phoneNumber` is required for the given driver
3005  | Given driver already exists, duplicate key error  | `Drivers`  | None | 
4001  | Passenger with {0} {1} does not exist   | `Passengers`  | `0 - Property Name`, `1- Value` | Passenger with `emailAddress` `123@abc.com` does not exist
4002  | Invalid {0} format for the given passenger  | `Passengers`  | `0 - Property Name` | Invalid `emailAddress` format for the given passenger
4003 | Invalid property {0} for the given passenger  | `Passengers` | `0 - Property Name` | Invalid property `color` for the given passenger
4004  | Property {0} is required for the given passenger | `Passengers`  | `0 - Property Name` | Property `emailAddress` is required for the given passengers
4005  | Given passenger already exists, duplicate key error  | `Passengers`  | None | 

### Test Cases
```
Service running on port 8080

  ✓ cars_delete_all_car (731ms)
  ✓ cars01_should_create_car (242ms)
  ✓ cars02_should_get_car (162ms)
  ✓ cars03_should_delete_car (140ms)
57f6eff047cc141ca0c67af3
  ✓ cars04_should_not_get_deleted_car (141ms)
  ✓ cars05_should_not_get_random_id_car (72ms)
  ✓ cars06_should_not_create_car_missing_make
  ✓ cars07_should_not_create_car_with_long_make
  ✓ drivers_delete_all_car (79ms)
57f6eff047cc141ca0c67af9
  ✓ drivers01_should_create_driver (84ms)
  ✓ drivers02_should_get_driver (82ms)
  ✓ drivers03_should_delete_driver (80ms)
57f6eff047cc141ca0c67af9
  ✓ drivers04_should_not_get_deleted_driver (81ms)
  ✓ drivers05_should_not_get_random_id_driver
  ✓ drivers06_should_not_create_driver_missing_email_address
  ✓ drivers07_should_not_create_driver_with_long_first_name
  ✓ passengers01_delete_all_passenger (81ms)
  ✓ passengers01_should_create_passenger (93ms)
  ✓ passengers02_should_get_passenger (82ms)
  ✓ passengers03_should_delete_passenger (80ms)
  ✓ passengers04_should_not_get_deleted_passenger (79ms)
  ✓ passengers05_should_not_get_random_id_passenger
  ✓ passengers06_should_not_create_passenger_missing_email_address
  ✓ passengers07_should_not_create_passenger_with_long_first_name

  24 passing (2s)


```

