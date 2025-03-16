web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -e production -c 3
background_jobs: bin/rails solid_queue:start
release: bundle exec rails db:prepare