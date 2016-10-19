# Solution - Aroshi Handa - Assignment 6 

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

  ✓ create_token (627ms)
  ✓ cars_delete_all_car (623ms)
  ✓ cars01_should_create_car (359ms)
  ✓ cars02_should_get_car (191ms)
  ✓ cars03_should_delete_car (178ms)
57ffd4e00763fcf8334785ad
  ✓ cars04_should_not_get_deleted_car (175ms)
  ✓ cars05_should_not_get_random_id_car (93ms)
  ✓ cars06_should_not_create_car_missing_make (92ms)
  ✓ cars07_should_not_create_car_with_long_make (90ms)
  ✓ create_token (96ms)
  ✓ drivers_delete_all_car (173ms)
57ffd4e20763fcf8334785b4
  ✓ drivers01_should_create_driver (186ms)
  ✓ drivers02_should_get_driver (175ms)
  ✓ drivers03_should_delete_driver (180ms)
57ffd4e20763fcf8334785b4
  ✓ drivers04_should_not_get_deleted_driver (176ms)
  ✓ drivers05_should_not_get_random_id_driver (88ms)
  ✓ drivers06_should_not_create_driver_missing_email_address (106ms)
  ✓ drivers07_should_not_create_driver_with_long_first_name (88ms)
  ✓ create_token (180ms)
  ✓ passengers01_delete_all_passenger (177ms)
  ✓ passengers01_should_create_passenger (188ms)
  ✓ passengers02_should_get_passenger (174ms)
  ✓ passengers03_should_delete_passenger (184ms)
  ✓ passengers04_should_not_get_deleted_passenger (175ms)
  ✓ passengers05_should_not_get_random_id_passenger (89ms)
  ✓ passengers06_should_not_create_passenger_missing_email_address (311ms)
  ✓ passengers07_should_not_create_passenger_with_long_first_name (92ms)

  27 passing (5s)


```

