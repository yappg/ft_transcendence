##########################################    VARS     ##########################################

PROJECT := "transandance"

COMPOSE := "./src/docker-compose.yml"

RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RESET := \033[0m

##########################################    BUILD    ##########################################

build: down
	docker compose -p $(PROJECT) -f $(COMPOSE) up --build -d && \
	docker compose -p $(PROJECT) -f $(COMPOSE) up --build -d && \
	$(MAKE) logs

up: down
	@docker compose -p $(PROJECT) -f $(COMPOSE) up -d  && \
	$(MAKE) logs

down:
	@docker compose -p $(PROJECT) down --remove-orphans

logs:
	@docker compose -p $(PROJECT) logs -f

list:
	@echo "$(YELLOW)\n<========= containers =========>\n$(RESET)"  && \
	docker compose -p $(PROJECT) ps  && \
	echo "$(YELLOW)\n<=========   images   =========>\n$(RESET)"  && \
	docker compose -p $(PROJECT) images  && \

clean:
	docker compose -p $(PROJECT) down --rmi all --volumes --remove-orphans

re: clean build

########################################## DEVELOPMENT ##########################################

compose:
	@docker compose -f $(COMPOSE) "$(filter-out $@, $(MAKECMDGOALS))"

it:
	@docker compose -p $(PROJECT) exec -it "$(filter-out $@, $(MAKECMDGOALS))" "/bin/sh"

restart:
	@docker compose -p $(PROJECT) restart "$(filter-out $@, $(MAKECMDGOALS))"

##########################################   UTILITIES  ##########################################

prune:
	@echo "$(GREEN)>$(YELLOW) removing all docker resources: CONTRL + C to cancel...$(RESET)"
	@sleep 2
	@echo "$(GREEN)>$(YELLOW) Starting the pruning process: $(RESET)"
	@docker kill $$(docker ps -aq) 2>/dev/null || true
	@docker rm $$(docker ps -aq) 2>/dev/null || true
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true
	@docker rmi $$(docker images -aq) 2>/dev/null || true
	@echo "$(GREEN)>$(YELLOW) done.$(RESET)"

push:
	@echo "$(GREEN)>$(YELLOW) Adding changes to git...$(RESET)"
	git add .
	git status
	@echo "$(GREEN)>$(YELLOW) Committing changes...$(RESET)"
	git commit -m "$(filter-out $@, $(MAKECMDGOALS))"
	@echo "$(GREEN)>$(YELLOW) Pushing changes CONTRL + C to cancel...$(RESET)"
	@sleep 2
	git push

%:
	@true

#################################################################################################

.PHONEY: up down logs list clean re compose it restart prune push
