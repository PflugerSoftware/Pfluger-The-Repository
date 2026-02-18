-- Student quotes (trimmed to 4)
UPDATE project_blocks SET data = $${"columns": 2, "quotes": [{"text": "because it is wide and also big for a person", "author": "Student #1, Midland Freshman"}, {"text": "it gives me more room to work on, like if I am doing a poster I can put my whole poster on it", "author": "Student V19"}, {"text": "the wheels are lockable, they will not move around", "author": "Student #244, Midland Freshman"}, {"text": "they are too tall for the short people", "author": "Student #3, Midland Freshman"}]}$$::jsonb
WHERE id = 'x26-rb01-quotes-students';

-- Teacher quotes (trimmed to 4)
UPDATE project_blocks SET data = $${"columns": 2, "quotes": [{"text": "I have loved it and will be so sad when it is gone", "author": "T5"}, {"text": "I do not want to see the old chairs anymore", "author": "T6"}, {"text": "Steer away from bulky and heavy pieces", "author": "T3"}, {"text": "So many casters means it makes it hard to actually move the desks around", "author": "T5"}]}$$::jsonb
WHERE id = 'x26-rb01-quotes-teachers';
