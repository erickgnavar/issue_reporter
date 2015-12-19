gettext:
	mix gettext.extract
	mix gettext.merge priv/gettext --locale en
	mix gettext.merge priv/gettext --locale es
