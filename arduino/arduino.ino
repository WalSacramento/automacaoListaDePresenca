#include <SPI.h>
#include <MFRC522.h>
#include <SoftwareSerial.h>

// Pinos do RFID
#define RST_PIN 9
#define SS_PIN 10

// Configuração porta serial do ESP-01
SoftwareSerial espSerial(2, 3); // RX, TX

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);        // Serial para monitoramento
  espSerial.begin(9600);       // Comunicação com ESP-01
  SPI.begin();                 // Inicializa SPI
  rfid.PCD_Init();             // Inicializa RFID
  
  Serial.println("Sistema Iniciado");
  iniciarWiFi();               // Configurar conexão Wi-Fi
}

void loop() {
  // Verifica se há uma tag presente
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  // Lê o UID da tag
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  Serial.println("UID Lido: " + uid);

  // Envia o UID via ESP-01
  enviarUID(uid);

  delay(1000); // Evita leituras repetitivas
}

// Função para iniciar a conexão Wi-Fi
void iniciarWiFi() {
  enviarComandoAT("AT+RST", 2000);       // Reinicia o ESP-01
  enviarComandoAT("AT+CWMODE=1", 1000); // Configura o modo STA (Station)
  enviarComandoAT("AT+CWJAP=\"Sacramento\",\"26022001\"", 10000); // Conecta ao Wi-Fi

  Serial.println("Verificando conexão Wi-Fi...");
  enviarComandoAT("AT+CWJAP?", 2000);   // Verifica se está conectado ao Wi-Fi

  Serial.println("Obtendo IP do ESP-01...");
  enviarComandoAT("AT+CIFSR", 2000);    // Exibe o IP atribuído ao ESP-01
}

// Função para enviar o UID para o servidor
void enviarUID(String uid) {
  // Estabelecer conexão TCP
  String comando = "AT+CIPSTART=\"TCP\",\"192.168.100.22\",8000";
  enviarComandoAT(comando.c_str(), 2000); // Tenta abrir a conexão

  // Montar requisição HTTP
  String httpRequest = "GET /arduino/rfid/" + uid + " HTTP/1.1\r\n";
  httpRequest += "Host: 192.168.100.22\r\n";
  httpRequest += "Connection: close\r\n\r\n";

  // Enviar o tamanho da requisição
  int tamanho = calcularTamanhoHTTP(httpRequest);
  String sendCommand = "AT+CIPSEND=" + String(tamanho);
  enviarComandoAT(sendCommand.c_str(), 2000);

  delay(500); // Aguarda pelo sinal '>'

  // Enviar a requisição HTTP
  Serial.println("Enviando requisição HTTP...");
  espSerial.print(httpRequest);

  delay(2000); // Tempo para processar a requisição

  // Fechar a conexão
  enviarComandoAT("AT+CIPCLOSE", 1000);
}

// Função para calcular o tamanho da requisição HTTP
int calcularTamanhoHTTP(String httpRequest) {
  return httpRequest.length();
}

// Função para enviar comandos AT para o ESP-01
void enviarComandoAT(const char* comando, unsigned long timeout) {
  espSerial.println(comando); // Envia o comando
  unsigned long tempo = millis();
  
  Serial.print("Comando Enviado: ");
  Serial.println(comando);

  while (millis() - tempo < timeout) {
    while (espSerial.available()) {
      char c = espSerial.read();
      Serial.print(c); // Exibe a resposta no Monitor Serial
    }
  }
  Serial.println(); // Nova linha para separar comandos
}
