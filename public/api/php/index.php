<?php

// !!!!!! THIS IS VERY BASIC AND JUST A TEST !!!!!!


$dbHost = getenv('DB_HOST') ? getenv('DB_HOST') : '127.0.0.1';
$dbUsername = getenv('DB_USERNAME') ? getenv('DB_USERNAME') : 'username';
$dbPassword = getenv('DB_PASSWORD') ? getenv('DB_PASSWORD') : '';

$input = json_decode(file_get_contents("php://input"));

$command = null;

$uri = trim($_SERVER['REQUEST_URI'], '/');
$bits = explode('/', $uri);
$bits = array_reverse($bits);

$command = \str_replace('.json', '', $bits[0]);

$data = [
    "meta"=> [
        "version"=>0.1
    ],
    'uri'=>$_SERVER['REQUEST_URI'],
    'command'=>$command,
    'input'=>$input,
    'errors'=>[

    ]
];

function getMysqli($dbHost, $dbUsername, $dbPassword, $dbName=''){
    $mysqli = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

    return $mysqli;
}

switch($command){
    case 'log-in':

        $data['payload'] = [
            'loggedIn'=>true,
            'token'=>'UGlf7RULFYLHJydfr8yHLYF7TYHKUH'
        ];

        break;
    case 'log-out':

        $data['payload'] = [
            'loggedIn'=>false,
            'token'=>null
        ];

        break;
    case 'browse':

        $mysqli = getMysqli($dbHost, $dbUsername, $dbPassword, $input->database);

        $input->perPage = !empty($input->perPage) ? $input->perPage : 30;
        $input->page = !empty($input->page) ? $input->page : 1;

        $data['payload'] = [
            'name'=>$input->table,
            'pagination'=>[
                'showing'=>$input->perPage,
                'page'=>$input->page,
                'pages'=>0,
                'total'=>0
            ],
            'fields'=>[],
            'rows'=>[]
        ];

        $query = 'DESCRIBE `'.$input->table.'`';
        if( $stmt = $mysqli->prepare($query) )
        {
            $stmt->bind_result($field, $type, $null, $key, $default, $extra);
            $stmt->execute();
            while ($stmt->fetch()) {
                $data['payload']['fields'][] = [
                    'name'=>$field,
                    'type'=>$type,
                    'null'=>$null,
                    'key'=>$key,
                    'default'=>$default,
                    'extra'=>$extra
                ];
            }
        }
        else
        {
            $data['errors'][] = 'prepare statement failed : '.$mysqli->error;
        }


        $query = 'SELECT count(*) AS total FROM `'.$input->table.'`';
        if( $stmt = $mysqli->prepare($query) )
        {
            $result = $mysqli->query($query);
            $row = $result->fetch_assoc();
            $data['payload']['pagination']['total'] = $row['total'];
            $data['payload']['pagination']['pages'] = ceil($row['total'] / $input->perPage);
        }
        else
        {
            $data['errors'][] = 'prepare statement failed : '.$mysqli->error;
        }


        $offset = 0;
        if($input->perPage > 1)
            $offset = ($input->page - 1) * $input->perPage;

        $query = 'SELECT * FROM `'.$input->table.'` LIMIT '.$offset.','.$input->perPage;
        if( $stmt = $mysqli->prepare($query) )
        {
            $result = $mysqli->query($query);
            while ($row = $result->fetch_assoc()) {
                $newRow = [];

                foreach($row as $name=>$value){
                    $newRow[] = [
                        'name'=>$name,
                        'value'=>$value
                    ];
                }
                $data['payload']['rows'][] = $newRow;
            }
        }
        else
        {
            $data['errors'][] = 'prepare statement failed : '.$mysqli->error;
        }


        break;
    case 'databases':

        $mysqli = getMysqli($dbHost, $dbUsername, $dbPassword);

        $query = 'SHOW DATABASES';

        if( $stmt = $mysqli->prepare($query) )
        {
            $stmt->bind_result($db);
            $stmt->execute();

            $data['payload'] = [
                'databases'=>[]
            ];
            while ($stmt->fetch()) {
                $data['payload']['databases'][] = [
                    'name'=>$db
                ];
            }
        }
        else
        {
            $data['errors'][] = 'prepare statement failed';
        }


        break;
    case 'fields':

        $mysqli = getMysqli($dbHost, $dbUsername, $dbPassword, $input->database);

        $query = 'DESCRIBE `'.$input->table.'`';
        if( $stmt = $mysqli->prepare($query) )
        {
            // $stmt->bind_param('s', $input->table);

            $stmt->bind_result($field, $type, $null, $key, $default, $extra);
            $stmt->execute();

            $data['payload'] = [
                'fields'=>[]
            ];
            while ($stmt->fetch()) {
                $data['payload']['fields'][] = [
                    'name'=>$field,
                    'type'=>$type,
                    'null'=>$null,
                    'key'=>$key,
                    'default'=>$default,
                    'extra'=>$extra
                ];
            }
        }
        else
        {
            $data['errors'][] = 'prepare statement failed : '.$mysqli->error;
        }




        /*
            {
              "meta": {
                "version": 0.1
              },
              "payload": {
                "fields": [
                  {"name": "field1", "type":"varchar"},
                  {"name": "my_field", "type":"int"},
                  {"name": "Username", "type":"varchar"},
                  {"name": "legacy_field", "type":"text"},
                  {"name": "Some_Field", "type":"boolean"},
                  {"name": "Counter", "type":"int"}
                ]
              }
            }
        */

        break;
    case 'tables':

        $mysqli = getMysqli($dbHost, $dbUsername, $dbPassword, $input->database);

        $query = 'SHOW TABLES';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_result($name);
        $stmt->execute();

        $data['payload'] = [
            'tables'=>[]
        ];
        while ($stmt->fetch()) {
            $data['payload']['tables'][] = [
                'name'=>$name
            ];
        }

        /*

            {
              "meta": {
                "version": 0.1
              },
              "payload": {
                "tables": [
                  {"name": "table1"},
                  {"name": "my_table"},
                  {"name": "Users"},
                  {"name": "legacy_table"},
                  {"name": "Some_Table"},
                  {"name": "CacheTable"}
                ]
              }
            }

        */

        break;
}


header('Content-Type: application/json');
echo json_encode($data);