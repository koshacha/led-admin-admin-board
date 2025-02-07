<?php
header('Content-Type: application/json');

require_once '.env.php';

function generateToken($username) {
    return hash('sha256', $username . time() . 'secret_salt');
}

function handleAuth() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data['username'] === ADMIN_USERNAME && $data['password'] === ADMIN_PASSWORD) {
        $token = generateToken($data['username']);
        echo json_encode(['success' => true, 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Неверные учетные данные']);
    }
}

function handleSave() {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (file_put_contents('prices.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении файла']);
    }
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'auth':
        handleAuth();
        break;
    case 'save':
        handleSave();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Неизвестное действие']);
}
?>