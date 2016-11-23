
.PHONY: web

web:
	rsync -a --exclude=.git ~/Dropbox/Programming/active/map-tools mhlinder:~/public_html

