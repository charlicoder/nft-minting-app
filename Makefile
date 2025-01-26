# Define variables
CONTRACT_DIR=hellonft
APP_DIR=webapp

# Default target
all: setup

# Clone the repository and run the setup
setup:
	@echo "Setting up the application..."
	cd $(CONTRACT_DIR) && npm install && cd ../$(APP_DIR) && npm install


cc:
	cd $(CONTRACT_DIR) && npx hardhat compile

deployc:
	@read -p "Enter network name (localhost|sepolia): " name; \
	cd $(CONTRACT_DIR) && npx hardhat ignition deploy ignition/modules/HelloToken.js --network $$name
	
runapp:
	cd $(APP_DIR) && npm install && npm run dev

