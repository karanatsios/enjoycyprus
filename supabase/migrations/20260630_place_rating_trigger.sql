-- Auto-update places.rating_avg and places.rating_count on new reviews

create or replace function update_place_rating()
returns trigger language plpgsql as $$
begin
  update places
  set
    rating_avg   = (select avg(rating)::numeric(3,2) from place_reviews where place_id = NEW.place_id),
    rating_count = (select count(*)                 from place_reviews where place_id = NEW.place_id)
  where id = NEW.place_id;
  return NEW;
end;
$$;

drop trigger if exists trg_update_place_rating on place_reviews;
create trigger trg_update_place_rating
  after insert or update or delete on place_reviews
  for each row execute function update_place_rating();

-- Enable Realtime for places table so clients can subscribe
alter publication supabase_realtime add table places;
